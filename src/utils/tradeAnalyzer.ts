import { Trade, TradeAnalysis, Player } from '../types';

export const analyzeTradeAI = (trade: Trade): TradeAnalysis => {
  const { user1Players, user2Players } = trade;
  
  // Calculate weighted values for each player
  const calculatePlayerValue = (player: Player): number => {
    const baseValue = player.stats.fantasyPoints.ppr;
    const projectionBonus = player.projections.projectedPoints.ppr * 0.3;
    const positionMultiplier = getPositionMultiplier(player.position);
    const injuryPenalty = getInjuryPenalty(player.injuryStatus);
    const trendBonus = getTrendBonus(player.stats.trend);
    
    return (baseValue + projectionBonus) * positionMultiplier * injuryPenalty * trendBonus;
  };
  
  // Position-based value multipliers
  const getPositionMultiplier = (position: string): number => {
    switch (position) {
      case 'QB': return 1.1;
      case 'RB': return 1.2;
      case 'WR': return 1.0;
      case 'TE': return 0.9;
      case 'K': return 0.5;
      case 'DEF': return 0.6;
      default: return 1.0;
    }
  };
  
  // Injury status penalties
  const getInjuryPenalty = (status: string): number => {
    switch (status) {
      case 'healthy': return 1.0;
      case 'questionable': return 0.9;
      case 'doubtful': return 0.7;
      case 'out': return 0.5;
      case 'ir': return 0.2;
      default: return 1.0;
    }
  };
  
  // Trend bonuses/penalties
  const getTrendBonus = (trend: string): number => {
    switch (trend) {
      case 'up': return 1.1;
      case 'down': return 0.9;
      default: return 1.0;
    }
  };
  
  // Calculate total values
  const user1Value = user1Players.reduce((sum, player) => sum + calculatePlayerValue(player), 0);
  const user2Value = user2Players.reduce((sum, player) => sum + calculatePlayerValue(player), 0);
  const difference = user1Value - user2Value;
  
  // Determine winner
  let winner: 'user1' | 'user2' | 'even';
  if (Math.abs(difference) < 5) {
    winner = 'even';
  } else {
    winner = difference > 0 ? 'user1' : 'user2';
  }
  
  // Calculate fairness score (0-100)
  const maxValue = Math.max(user1Value, user2Value);
  const fairnessScore = Math.max(0, 100 - (Math.abs(difference) / maxValue) * 100);
  
  // Assign grade based on fairness
  let grade: 'A' | 'B' | 'C' | 'D' | 'F';
  if (fairnessScore >= 90) grade = 'A';
  else if (fairnessScore >= 80) grade = 'B';
  else if (fairnessScore >= 70) grade = 'C';
  else if (fairnessScore >= 60) grade = 'D';
  else grade = 'F';
  
  // Generate recommendations
  const recommendations = generateRecommendations(user1Players, user2Players, difference, winner, fairnessScore, grade);
  
  // Calculate confidence based on various factors
  const confidence = Math.min(1, 0.7 + (fairnessScore / 1000) + (Math.min(user1Players.length, user2Players.length) / 10));
  
  return {
    fairnessScore,
    grade,
    winner,
    recommendations,
    breakdown: {
      user1Value,
      user2Value,
      difference
    },
    confidence
  };
};

const generateRecommendations = (
  user1Players: Player[], 
  user2Players: Player[], 
  difference: number,
  winner: 'user1' | 'user2' | 'even',
  fairnessScore: number,
  grade: 'A' | 'B' | 'C' | 'D' | 'F'
): string[] => {
  const recommendations: string[] = [];
  
  // Base recommendations on fairness score and grade rather than just winner
  if (fairnessScore >= 85 || grade === 'A') {
    recommendations.push("This is an excellent, well-balanced trade that benefits both teams fairly.");
    recommendations.push("Both teams are getting good value - this trade should be accepted.");
    recommendations.push("Consider the players' playoff schedules and bye weeks before finalizing.");
  } else if (fairnessScore >= 75 || grade === 'B') {
    recommendations.push("This is a solid trade with good value for both sides.");
    if (winner !== 'even') {
      const advantagedTeam = winner === 'user1' ? 'Team 1' : 'Team 2';
      recommendations.push(`${advantagedTeam} gets slightly better value, but the trade is still fair.`);
    }
    recommendations.push("Consider roster needs and player schedules when making your decision.");
  } else if (fairnessScore >= 60 || grade === 'C') {
    recommendations.push("This is a well-balanced trade that benefits both teams fairly.");
    recommendations.push("Consider the players' playoff schedules and bye weeks before finalizing.");
    if (winner !== 'even') {
      const losingTeam = winner === 'user1' ? 'Team 2' : 'Team 1';
      recommendations.push(`${losingTeam} might want to request a small additional piece to balance the trade.`);
    }
  } else if (fairnessScore >= 40 || grade === 'D') {
    const losingTeam = winner === 'user1' ? 'Team 2' : 'Team 1';
    
    recommendations.push(`${losingTeam} should request additional value to balance this trade.`);
    recommendations.push(`Consider adding a bench player or future draft pick to even out the value.`);
  } else {
    // Grade F or very low fairness score
    const losingTeam = winner === 'user1' ? 'Team 2' : 'Team 1';
    
    recommendations.push("This trade heavily favors one side and should be reconsidered.");
    recommendations.push(`${losingTeam} is giving up significantly more value than they're receiving.`);
    recommendations.push("Consider restructuring the trade or adding more players to balance the value.");
  }
  
  // Position-specific recommendations
  const user1Positions = user1Players.map(p => p.position);
  const user2Positions = user2Players.map(p => p.position);
  
  if (user1Positions.includes('QB') && !user2Positions.includes('QB')) {
    recommendations.push("Team 1 is trading away QB depth - ensure you have adequate backup options.");
  }
  
  if (user1Positions.filter(p => p === 'RB').length > 1) {
    recommendations.push("Team 1 is trading multiple RBs - consider the scarcity of the position.");
  }
  
  // Injury concerns
  const injuredPlayers = [...user1Players, ...user2Players].filter(
    p => p.injuryStatus !== 'healthy'
  );
  
  if (injuredPlayers.length > 0) {
    recommendations.push("Monitor injury reports closely before finalizing this trade.");
  }
  
  return recommendations;
};