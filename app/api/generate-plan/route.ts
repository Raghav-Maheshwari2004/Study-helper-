import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { subjectName, syllabus, examDate, hoursPerDay, difficulty } = await req.json();

    // --- 1. SMART PARSING & SETUP ---
    const today = new Date();
    const exam = new Date(examDate);
    const diffTime = Math.abs(exam.getTime() - today.getTime());
    const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Split syllabus intelligently (handling commas, newlines, numbering like "1.", "-")
    let rawTopics = syllabus
      .split(/,|\n|\r|\t|•|- /)
      .map((t: string) => t.trim().replace(/^\d+[\.)]\s*/, '')) // Remove "1. " or "2."
      .filter((t: string) => t.length > 3); // Ignore tiny fragments

    // Fallback if syllabus is empty
    if (rawTopics.length === 0) {
      const genericUnits = [
        "Core Concepts & Definitions", "Fundamental Theories", "Key Formulas & Derivations",
        "Advanced Applications", "Case Studies & Examples", "Problem Solving Techniques",
        "Critical Analysis", "Modern Developments"
      ];
      // Generate enough topics to fill the days
      rawTopics = Array.from({ length: Math.max(daysLeft, 5) }, (_, i) => 
        genericUnits[i % genericUnits.length] || `Unit ${i+1}: ${subjectName} Basics`
      );
    }

    // --- 2. THE "BRAIN" (HEURISTICS) ---
    const plan = [];
    
    // Determine Phase Ratios based on days available
    // Standard Rule: 60% Learning, 20% Practice, 20% Revision
    let learningDays = Math.floor(daysLeft * 0.6);
    let practiceDays = Math.floor(daysLeft * 0.2);
    let revisionDays = daysLeft - learningDays - practiceDays;

    // Adjust for Difficulty
    if (difficulty === "Hard") {
      // Hard mode: Less learning, more practice/testing
      learningDays = Math.floor(daysLeft * 0.5); 
      practiceDays = Math.floor(daysLeft * 0.3);
      revisionDays = daysLeft - learningDays - practiceDays;
    } else if (difficulty === "Easy") {
      // Easy mode: More learning time, less intense drilling
      learningDays = Math.floor(daysLeft * 0.7);
      practiceDays = Math.floor(daysLeft * 0.15);
      revisionDays = daysLeft - learningDays - practiceDays;
    }

    // Ensure at least 1 day for each if possible
    if (daysLeft >= 3) {
      learningDays = Math.max(1, learningDays);
      revisionDays = Math.max(1, revisionDays);
    } else {
      // Panic mode: All revision
      learningDays = 0; practiceDays = 0; revisionDays = daysLeft;
    }

    // --- 3. GENERATE DAY-BY-DAY ---
    let topicIndex = 0;
    const topicsPerDay = Math.ceil(rawTopics.length / Math.max(learningDays, 1));

    for (let day = 1; day <= daysLeft; day++) {
      let dailyTopics = [];
      let focus = "";
      let phase = "";

      // Determine Phase
      if (day <= learningDays) {
        phase = "LEARNING";
        // Grab new topics
        const start = topicIndex;
        const end = Math.min(start + topicsPerDay, rawTopics.length);
        dailyTopics = rawTopics.slice(start, end);
        topicIndex = end;

        // If we ran out of topics early, reuse broadly
        if (dailyTopics.length === 0) dailyTopics = ["Consolidation of previous topics", "Buffer day for weak areas"];

        // Creative "Focus" generation
        const verbs = ["Master", "Understand", "Deep dive into", "Explore", "Deconstruct"];
        focus = `${verbs[day % verbs.length]} the core concepts of ${dailyTopics[0] || subjectName}.`;
      
      } else if (day <= learningDays + practiceDays) {
        phase = "PRACTICE";
        dailyTopics = ["Practice Problems", "Case Studies", "Application Questions"];
        
        if (difficulty === "Hard") dailyTopics.push("Advanced Drills");
        
        focus = difficulty === "Hard" 
          ? "Intensive problem-solving and speed drills." 
          : "Apply concepts to practical examples and standard problems.";

      } else {
        phase = "REVISION";
        dailyTopics = ["Full Syllabus Review", "Mock Test / Past Papers", "Key Formulas List"];
        
        focus = day === daysLeft 
          ? "Light review and mental preparation. Relax before the exam." 
          : "Simulate exam conditions and identify remaining gaps.";
      }

      // Add "Smart" details based on hours
      let advice = "";
      if (hoursPerDay > 6) advice = " (Take a 10m break every hour!)";
      else if (hoursPerDay < 2) advice = " (High-intensity focus required)";

      plan.push({
        day,
        phase, 
        topics: dailyTopics,
        focus: focus + advice
      });
    }

    // --- 4. RETURN RESULT ---
    // Add a tiny random delay to simulate "thinking"
    await new Promise(resolve => setTimeout(resolve, 800));

    console.log(`✅ Generated Smart Plan for ${subjectName} (${difficulty} Mode)`);
    return NextResponse.json({ plan }, { status: 200 });

  } catch (error) {
    console.error("Generator Error:", error);
    return NextResponse.json({ error: "Failed to generate plan" }, { status: 500 });
  }
}