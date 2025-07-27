#!/usr/bin/env node

const { Client } = require('@notionhq/client');
require('dotenv').config();

async function main() {
  const token = process.env.NOTION_TOKEN;
  const parentPageId = process.env.NOTION_PARENT_PAGE_ID;
  if (!token || !parentPageId) {
    console.error('❌ Missing NOTION_TOKEN or NOTION_PARENT_PAGE_ID in .env');
    process.exit(1);
  }

  const notion = new Client({ auth: token });

  console.log('🚀 Creating Fall 2025 Academic Dashboard...');

  // Create master dashboard page
  const master = await notion.pages.create({
    parent: { page_id: parentPageId },
    properties: {
      title: [ { text: { content: '🎓 Fall 2025 Dashboard' } } ]
    },
    children: [
      {
        object: 'block',
        type: 'heading_1',
        heading_1: {
          rich_text: [ { text: { content: 'Fall 2025 Academic Dashboard' } } ]
        }
      },
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [ {
            text: {
              content:
                'Everything you need to manage your courses, assignments, study sessions and resources for the Fall 2025 term.'
            }
          } ]
        }
      },
      { object: 'block', type: 'divider', divider: {} }
    ]
  });
  const dashboardId = master.id;
  console.log('✨ Master Dashboard created:', dashboardId);

  /**
   * Helper function to create a database within the dashboard.
   * @param {string} title The database title with emoji.
   * @param {Object} properties Property definitions for the database.
   * @returns {Promise<string>} The ID of the newly created database.
   */
  async function createDatabase(title, properties) {
    const db = await notion.databases.create({
      parent: { page_id: dashboardId },
      title: [ { text: { content: title } } ],
      properties
    });
    console.log(`📚 Created database: ${title}`);
    return db.id;
  }

  // 1. Create Courses database
  const coursesId = await createDatabase('📚 Courses', {
    'Course Name': { title: {} },
    'Code': { rich_text: {} },
    'Credits': { number: { format: 'number' } },
    'Instructor': { rich_text: {} },
    'Meeting Times': { rich_text: {} },
    'Location': { rich_text: {} },
      'Status': {
        select: {
          options: [
            { name: 'In Progress', color: 'yellow' },
            { name: 'Completed', color: 'green' },
            { name: 'Dropped', color: 'red' }
          ]
        }
      }
    });
    
  // 2. Create Assignments database
  const assignmentsId = await createDatabase('📝 Assignments', {
    'Assignment': { title: {} },
    'Course': {
      relation: {
        database_id: coursesId,
        single_property: {}
      }
    },
    'Due Date': { date: {} },
    'Type': {
      select: {
        options: [
          { name: 'Homework', color: 'blue' },
          { name: 'Quiz', color: 'purple' },
          { name: 'Exam', color: 'red' },
          { name: 'Lab', color: 'orange' },
          { name: 'Project', color: 'green' },
          { name: 'Reading', color: 'gray' }
        ]
      }
    },
    'Weight': { number: { format: 'percent' } },
    'Score': { number: { format: 'number' } },
    'Total Points': { number: { format: 'number' } },
    'Weighted Score': {
      formula: {
        expression: 'if(prop("Total Points") > 0, prop("Score") / prop("Total Points") * prop("Weight"), 0)'
      }
    },
    'Status': {
      select: {
        options: [
          { name: 'Not Started', color: 'gray' },
          { name: 'In Progress', color: 'yellow' },
          { name: 'Completed', color: 'green' }
        ]
      }
    },
    'Priority': {
      select: {
        options: [
          { name: 'Low', color: 'green' },
          { name: 'Medium', color: 'yellow' },
          { name: 'High', color: 'red' }
        ]
      }
    },
    'Notes': { rich_text: {} },
    'Link': { url: {} }
  });   
 
// 3. Create Lectures database
  const lecturesId = await createDatabase('📖 Lectures', {
    'Lecture': { title: {} },
    'Course': {
      relation: {
        database_id: coursesId,
        single_property: {}
      }
    },
    'Date': { date: {} },
    'Topic': { rich_text: {} },
    'Notes': { rich_text: {} },
    'Resources': { url: {} }
  });

  // 4. Create Study Sessions database
  const sessionsId = await createDatabase('⏰ Study Sessions', {
    'Session': { title: {} },
    'Course': {
      relation: {
        database_id: coursesId,
        single_property: {}
      }
    },
    'Date': { date: {} },
    'Duration (min)': { number: { format: 'number' } },
    'Type': {
      select: {
        options: [
          { name: 'Lecture Review', color: 'blue' },
          { name: 'Homework', color: 'purple' },
          { name: 'Lab', color: 'orange' },
          { name: 'Project', color: 'green' },
          { name: 'Exam Prep', color: 'red' }
        ]
      }
    },
    'Notes': { rich_text: {} }
  });

  // 5. Create Resources database
  const resourcesId = await createDatabase('📚 Resources', {
    'Title': { title: {} },
    'Course': {
      relation: {
        database_id: coursesId,
        single_property: {}
      }
    },
    'Type': {
      select: {
        options: [
          { name: 'Book', color: 'brown' },
          { name: 'Article', color: 'blue' },
          { name: 'Video', color: 'red' },
          { name: 'Slide', color: 'purple' },
          { name: 'Website', color: 'orange' }
        ]
      }
    },
    'Link': { url: {} },
    'Completed': { checkbox: {} },
    'Notes': { rich_text: {} }
  });

  // 6. Create Quick Notes database
  const notesId = await createDatabase('🗒️ Quick Notes', {
    'Note': { title: {} },
    'Date': { date: {} },
    'Tag': {
      select: {
        options: [
          { name: 'Idea', color: 'blue' },
          { name: 'Reminder', color: 'green' },
          { name: 'Quote', color: 'yellow' },
          { name: 'Reflection', color: 'purple' }
        ]
      }
    },
    'Content': { rich_text: {} },
    'Completed': { checkbox: {} }
  });

  // 7. Create To‑Do tasks database
  const todosId = await createDatabase('✅ To‑Do', {
    'Task': { title: {} },
    'Due Date': { date: {} },
    'Category': {
      select: {
        options: [
          { name: 'School', color: 'green' },
          { name: 'Personal', color: 'blue' },
          { name: 'Other', color: 'gray' }
        ]
      }
    },
    'Status': {
      select: {
        options: [
          { name: 'Not Started', color: 'gray' },
          { name: 'In Progress', color: 'yellow' },
          { name: 'Completed', color: 'green' }
        ]
      }
    },
    'Priority': {
      select: {
        options: [
          { name: 'Low', color: 'green' },
          { name: 'Medium', color: 'yellow' },
          { name: 'High', color: 'red' }
        ]
      }
    },
    'Notes': { rich_text: {} }
  });

  // 8. Create Goals database
  const goalsId = await createDatabase('🎯 Goals', {
    'Goal': { title: {} },
    'Category': {
      select: {
        options: [
          { name: 'Academic', color: 'blue' },
          { name: 'Personal', color: 'orange' },
          { name: 'Career', color: 'green' }
        ]
      }
    },
    'Target Date': { date: {} },
    'Progress (%)': { number: { format: 'percent' } },
    'Notes': { rich_text: {} }
  });

  // Update Courses DB: Step 1 - Add relation and rollups
  console.log('🔗 Step 1/2: Adding relation and rollups to Courses...');
  await notion.databases.update({
    database_id: coursesId,
    properties: {
      'Assignments': {
        relation: {
          database_id: assignmentsId,
          single_property: {}
        }
      },
      'Total Weighted Score': {
        rollup: {
          relation_property_name: 'Assignments',
          rollup_property_name: 'Weighted Score',
          function: 'sum'
        }
      },
      'Total Weight': {
        rollup: {
          relation_property_name: 'Assignments',
          rollup_property_name: 'Weight',
          function: 'sum'
        }
      }
    }
  });

  // Update Courses DB: Step 2 - Add the combined Letter Grade formula
  console.log('🔗 Step 2/2: Adding combined Letter Grade formula...');
  await notion.databases.update({
    database_id: coursesId,
    properties: {
      'Letter Grade': {
        formula: {
          expression: 'if(empty(prop("Total Weight")) or prop("Total Weight") == 0, "N/A", if(prop("Total Weighted Score") / prop("Total Weight") >= 0.9, "A", if(prop("Total Weighted Score") / prop("Total Weight") >= 0.8, "B", if(prop("Total Weighted Score") / prop("Total Weight") >= 0.7, "C", if(prop("Total Weighted Score") / prop("Total Weight") >= 0.6, "D", "F")))))'
        }
      }
    }
  });
  console.log('✅ Successfully added rollups and grade formulas to Courses');

  // Pre-populate Courses database with sample entries for Fall 2025
  const sampleCourses = [
    {
      name: 'MTH 251Z – Differential Calculus',
      code: 'MTH 251Z',
      credits: 4,
      instructor: 'TBA',
      meeting: 'MWF – see schedule',
      location: 'Campus – TBD',
      status: 'In Progress',
      notes:
        'Differential calculus for engineers and scientists covering limits, derivatives, related rates and optimization; emphasises conceptual understanding and applications.'
    },
    {
      name: 'PH 211 – General Physics with Calculus',
      code: 'PH 211',
      credits: 4,
      instructor: 'TBA',
      meeting: 'MWF lectures + lab',
      location: 'Campus – TBD',
      status: 'In Progress',
      notes:
        'Calculus‑based introduction to classical mechanics including motion in one and two dimensions, Newton’s laws, momentum, energy and laboratory experiments.'
    },
    {
      name: 'CS 261‑01 – Computer Science I (Data Structures in C/C++)',
      code: 'CS 261‑01',
      credits: 4,
      instructor: 'TBA',
      meeting: 'MWF lectures + recitations',
      location: 'Campus – TBD',
      status: 'In Progress',
      notes:
        'Introduction to data structures and algorithms implemented in C/C++, covering dynamic arrays, linked lists, stacks, queues, trees, heaps, graphs and associated analysis.'
    }
  ];

  for (const course of sampleCourses) {
    await notion.pages.create({
      parent: { database_id: coursesId },
      properties: {
        'Course Name': { title: [ { text: { content: course.name } } ] },
        'Code': { rich_text: [ { text: { content: course.code } } ] },
        'Credits': { number: course.credits },
        'Instructor': { rich_text: [ { text: { content: course.instructor } } ] },
        'Meeting Times': { rich_text: [ { text: { content: course.meeting } } ] },
        'Location': { rich_text: [ { text: { content: course.location } } ] },
        'Status': { select: { name: course.status } }
      },
      children: [
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [ { text: { content: course.notes } } ]
          }
        }
      ]
    });
    console.log(`✅ Added course entry: ${course.code}`);
  }

  console.log('🎉 Fall 2025 Academic Dashboard setup complete!');
  console.log(`🔗 Dashboard URL: https://notion.so/${dashboardId.replace(/-/g, '')}`);
}

main().catch((err) => {
  console.error('❌ Error creating dashboard:', err);
  process.exit(1);
});