import { createClient } from '@supabase/supabase-js';

export async function POST(request) {
  try {
    const { query } = await request.json();
    const q = query.toLowerCase();

    const supabase = createClient(
      'https://dramlcryttixceczbfdp.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRyYW1sY3J5dHRpeGNlY3piZmRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyNjAxNzcsImV4cCI6MjA5NzgzNjE3N30.kAkJoiNnxVN_KbDpf7fUxseNzZkGejKdQ6s4knNfIIs'
    );

    const { data: activities } = await supabase
      .from('activities')
      .select('*');

    // Score each activity based on query keywords
    const scored = activities.map(a => {
      let score = 0;
      const text = `${a.title} ${a.location} ${a.difficulty} ${a.category} ${a.description}`.toLowerCase();

      // Budget matching
      const budgetMatch = q.match(/₹?(\d+)/);
      if (budgetMatch) {
        const budget = parseInt(budgetMatch[1]);
        if (a.price <= budget) score += 3;
      }

      // Difficulty matching
      if (q.includes('easy') && a.difficulty === 'Easy') score += 3;
      if (q.includes('beginner') && a.difficulty === 'Easy') score += 3;
      if (q.includes('hard') && a.difficulty === 'Hard') score += 3;
      if (q.includes('moderate') && a.difficulty === 'Moderate') score += 3;

      // Category matching
      if (q.includes('camp') && a.category === 'Camping') score += 4;
      if (q.includes('trek') && a.category === 'Trekking') score += 4;
      if (q.includes('hike') && a.category === 'Trekking') score += 4;
      if (q.includes('raft') && a.category === 'River rafting') score += 4;
      if (q.includes('water') && a.category === 'River rafting') score += 3;
      if (q.includes('cycl') && a.category === 'Cycling') score += 4;

      // Location matching
      if (q.includes('pune') && text.includes('pune')) score += 3;
      if (q.includes('mumbai') && text.includes('mumbai')) score += 3;
      if (q.includes('lonavala') && text.includes('lonavala')) score += 4;
      if (q.includes('kolad') && text.includes('kolad')) score += 4;

      // Group size
      if (q.includes('friend') || q.includes('group')) score += 1;
      if (q.includes('solo') || q.includes('alone')) score += 1;

      // Duration
      if (q.includes('weekend') || q.includes('2 day')) score += 2;
      if (q.includes('day trip') || q.includes('1 day')) score += 2;

      // Generate reason
      let reason = `Matches your interest in ${a.category.toLowerCase()}`;
      if (budgetMatch && a.price <= parseInt(budgetMatch[1])) {
        reason = `Within your budget at ₹${a.price} per person — ${a.difficulty.toLowerCase()} difficulty, perfect for your group`;
      } else if (q.includes('easy') && a.difficulty === 'Easy') {
        reason = `Great beginner-friendly option at ₹${a.price} per person in ${a.location}`;
      } else if (q.includes('camp') && a.category === 'Camping') {
        reason = `Top-rated camping experience at ₹${a.price} per person with ${a.rating}★ rating`;
      } else if (q.includes('trek') && a.category === 'Trekking') {
        reason = `Highly recommended trek at ₹${a.price} per person — ${a.reviews} reviews, rated ${a.rating}★`;
      }

      return { ...a, score, reason };
    });

    // Sort by score and return top 3
    const recommendations = scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(({ score, ...a }) => a);

    return Response.json({ recommendations });

  } catch (error) {
    console.error('AI finder error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}