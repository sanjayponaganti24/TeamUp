import { AVAILABILITY_STATUS } from '../constants/availability-status.js';

export const calculateMatch = (student, room) => {
  let score = 0;
  const reasons = [];

  const studentSkills = (student.skills || []).map((s) => s.toLowerCase().trim());
  const roomSkills = (room.requiredSkills || []).map((s) => s.toLowerCase().trim());

  // 1. Skill Match (Max 35 points)
  if (roomSkills.length > 0 && studentSkills.length > 0) {
    const matchedSkills = roomSkills.filter((rs) =>
      studentSkills.some((ss) => ss === rs || ss.includes(rs) || rs.includes(ss))
    );
    if (matchedSkills.length > 0) {
      const ratio = matchedSkills.length / roomSkills.length;
      const points = Math.round(ratio * 35);
      score += points;
      reasons.push(`✓ ${matchedSkills.length} matching skills (${matchedSkills.slice(0, 3).join(', ')})`);
    }
  } else if (studentSkills.length > 0) {
    score += 15;
    reasons.push('✓ Has demonstrated technical skills');
  }

  // 2. Preferred Role Match (Max 25 points)
  const studentRoles = (student.preferredRoles || []).map((r) => r.toLowerCase().trim());
  const roomRoles = (room.requiredRoles || []).map((r) => r.toLowerCase().trim());

  if (roomRoles.length > 0 && studentRoles.length > 0) {
    const matchedRoles = roomRoles.filter((rr) =>
      studentRoles.some((sr) => sr === rr || sr.includes(rr) || rr.includes(sr))
    );
    if (matchedRoles.length > 0) {
      score += 25;
      reasons.push(`✓ Target role match (${matchedRoles[0]})`);
    }
  } else if (studentRoles.length > 0) {
    score += 10;
  }

  // 3. Branch Compatibility (Max 15 points)
  const studentBranch = (student.branch || '').toLowerCase().trim();
  const roomBranches = (room.requiredBranches || []).map((b) => b.toLowerCase().trim());

  if (roomBranches.length > 0) {
    const isBranchMatch = roomBranches.some(
      (rb) => rb === studentBranch || studentBranch.includes(rb) || rb.includes(studentBranch)
    );
    if (isBranchMatch) {
      score += 15;
      reasons.push(`✓ Branch match (${student.branch})`);
    }
  } else {
    // Open to all branches
    score += 15;
    reasons.push('✓ Open to all engineering branches');
  }

  // 4. Interest & Project Match (Max 15 points)
  const studentInterests = (student.interests || []).map((i) => i.toLowerCase().trim());
  const roomType = (room.type || '').toLowerCase();
  const roomDesc = (room.description || '').toLowerCase();

  const matchedInterests = studentInterests.filter(
    (si) => roomDesc.includes(si) || roomType.includes(si)
  );

  if (matchedInterests.length > 0) {
    score += 15;
    reasons.push(`✓ Shared interests (${matchedInterests.slice(0, 2).join(', ')})`);
  } else if (student.projects && student.projects.length > 0) {
    score += 10;
    reasons.push(`✓ Experienced with ${student.projects.length} portfolio project(s)`);
  }

  // 5. Availability Status (Max 10 points)
  if (student.availability === AVAILABILITY_STATUS.AVAILABLE) {
    score += 10;
    reasons.push('✓ Readily available for collaboration');
  } else if (student.availability === AVAILABILITY_STATUS.WAITING) {
    score += 5;
    reasons.push('✓ Actively exploring opportunities');
  }

  // Normalize score between 10 and 100
  const finalScore = Math.min(100, Math.max(10, score));

  return {
    matchScore: finalScore,
    reasons,
  };
};
