#!/usr/bin/env node
/**
 * create-cs-dashboard.js
 *
 * Creates a comprehensive CS Student Dashboard template in Notion.
 * Generates interconnected databases and a master dashboard page.
 */

const { Client } = require('@notionhq/client');
require('dotenv').config();

// This async function wraps the entire script logic
async function main() {
  const token = process.env.NOTION_TOKEN;
  const parentPageId = process.env.NOTION_PARENT_PAGE_ID;

  if (!token || !parentPageId) {
    console.error('❌ Missing NOTION_TOKEN or NOTION_PARENT_PAGE_ID in .env');
    process.exit(1);
  }

  const notion = new Client({ auth: token });

  console.log('🚀 Creating CS Student Dashboard template...');

  // 1. Create Master Dashboard page
  const master = await notion.pages.create({
    parent: { page_id: parentPageId },
    properties: {
      title: [ { text: { content: '💻 CS Student Dashboard' } } ]
    },
    children: [
      { object: 'block', type: 'heading_1', heading_1: { rich_text: [ { text: { content: '💻 CS Student Dashboard' } } ] } },
      { object: 'block', type: 'paragraph', paragraph: { rich_text: [ { text: { content: 'Academic foundation, practical skills, and career growth in one template.' } } ] } },
      { object: 'block', type: 'divider', divider: {} }
    ]
  });
  const dashboardId = master.id;
  console.log('✨ Master Dashboard created:', dashboardId);

  // Helper to create database
  async function createDB(title, properties) {
    const db = await notion.databases.create({
      parent: { page_id: dashboardId },
      title: [ { text: { content: title } } ],
      properties
    });
    console.log(`📚 Created ${title}`);
    return db.id;
  }

  // 2. Create databases
  const ids = {};
  
  ids.courses = await createDB('📚 Courses', {
    'Course Name': { title: {} },
    'Code': { rich_text: {} },
    'Credits': { number: {} },
    'Semester': { select: { options: [] } },
    'Status': { select: { options: [ { name: 'Enrolled', color: 'blue' }, { name: 'Completed', color: 'green' } ] } },
    'Grade': { select: { options: [] } },
    'Syllabus': { url: {} }
  });

  ids.assignments = await createDB('📝 Assignments', {
    'Assignment': { title: {} },
    'Course': { 
      relation: { 
        database_id: ids.courses,
        single_property: {}
      } 
    },
    'Due Date': { date: {} },
    'Type': { select: { options: [ { name: 'Homework', color: 'blue' }, { name: 'Project', color: 'purple' } ] } },
    'Status': { select: { options: [ { name: 'Not Started', color: 'default' }, { name: 'In Progress', color: 'yellow' }, { name: 'Completed', color: 'green' } ] } },
    'Priority': { select: { options: [ { name: 'Low', color: 'gray' }, { name: 'Medium', color: 'yellow' }, { name: 'High', color: 'red' } ] } },
    'Notes': { rich_text: {} }
  });
  
  ids.sessions = await createDB('⏰ Study Sessions', {
    'Session': { title: {} },
    'Date': { date: {} },
    'Duration (min)': { number: {} },
    'Technique': { select: { options: [ { name: 'Pomodoro', color: 'orange' }, { name: 'Deep Work', color: 'blue' } ] } },
    'Notes': { rich_text: {} }
  });

  ids.coding = await createDB('💻 Coding Practice', {
    'Problem': { title: {} },
    'Platform': { select: { options: [ { name: 'LeetCode', color: 'orange' }, { name: 'HackerRank', color: 'green' } ] } },
    'Difficulty': { select: { options: [ { name: 'Easy', color: 'green' }, { name: 'Medium', color: 'yellow' }, { name: 'Hard', color: 'red' } ] } },
    'Status': { select: { options: [ { name: 'Solved', color: 'green' }, { name: 'Attempted', color: 'yellow' } ] } },
    'Date': { date: {} },
    'Notes': { rich_text: {} }
  });

  ids.skills = await createDB('🎯 Skills', {
    'Skill': { title: {} },
    'Category': { select: { options: [ { name: 'Frontend', color: 'blue' }, { name: 'Backend', color: 'green' } ] } },
    'Level': { select: { options: [ { name: 'Beginner', color: 'yellow' }, { name: 'Intermediate', color: 'orange' }, { name: 'Advanced', color: 'green' } ] } },
    'Progress': { number: { format: 'percent' } }
  });

  ids.interview = await createDB('📋 Interview Prep', {
    'Question': { title: {} },
    'Type': { select: { options: [ { name: 'Technical', color: 'blue' }, { name: 'Behavioral', color: 'purple' } ] } },
    'Status': { select: { options: [ { name: 'Todo', color: 'yellow' }, { name: 'Done', color: 'green' } ] } },
    'Notes': { rich_text: {} }
  });

  ids.career = await createDB('🏢 Career Tracker', {
    'Company': { title: {} },
    'Position': { rich_text: {} },
    'Status': { select: { options: [ { name: 'Applied', color: 'blue' }, { name: 'Interviewing', color: 'yellow' }, { name: 'Offer', color: 'green' } ] } },
    'Date Applied': { date: {} },
    'Notes': { rich_text: {} }
  });

  ids.certifications = await createDB('🏆 Certifications', {
    'Course': { title: {} },
    'Provider': { select: { options: [ { name: 'Coursera', color: 'blue' }, { name: 'edX', color: 'green' } ] } },
    'Status': { select: { options: [ { name: 'Planning', color: 'yellow' }, { name: 'Completed', color: 'green' } ] } },
    'Date Earned': { date: {} }
  });

  ids.projects = await createDB('🚀 Projects', {
    'Project': { title: {} },
    'Status': { select: { options: [ { name: 'Planning', color: 'gray' }, { name: 'Active', color: 'yellow' }, { name: 'Done', color: 'green' } ] } },
    'Start Date': { date: {} },
    'End Date': { date: {} },
    'GitHub': { url: {} },
    'Demo': { url: {} }
  });

  ids.resources = await createDB('📖 Resources', {
    'Title': { title: {} },
    'URL': { url: {} },
    'Category': { select: { options: [ { name: 'Tutorial', color: 'purple' }, { name: 'Documentation', color: 'blue' } ] } }
  });

  ids.goals = await createDB('🎓 Goals', {
    'Goal': { title: {} },
    'Category': { select: { options: [ { name: 'Academic', color: 'blue' }, { name: 'Career', color: 'green' } ] } },
    'Target': { date: {} },
    'Progress': { number: { format: 'percent' } }
  });

  console.log('✅ All databases created!');
  console.log(`🔗 Dashboard URL: https://notion.so/${dashboardId.replace(/-/g,'')}`);
}

// This calls the main function and catches any errors
main().catch(err => {
  console.error('❌ Error creating dashboard:', err);
  process.exit(1);
});
