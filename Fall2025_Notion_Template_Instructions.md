Fall 2025 Academic Dashboard Template

This package contains a Node.js script that uses the official Notion API to build
an end‑to‑end productivity dashboard for your Fall 2025 term. The design is
tailored around three core courses—MTH 251Z (Differential Calculus),
PH 211 (General Physics with Calculus) and CS 261‑01 (Data Structures in
C/C++)—but it is flexible enough to be adapted for other classes and to be
offered as a marketplace template. The database structure and formulas
incorporate the major assessment components described in official course
materials, such as homework, labs, midterms and final exams. For example,
MTH 251Z emphasises derivatives, rates of change and applications
sites.science.oregonstate.edu
, PH 211 covers
classical mechanics with topics like motion, momentum and Newton’s laws
sites.science.oregonstate.edu
and
CS 261 focuses on data structures—dynamic arrays, linked lists, stacks, queues,
trees, heaps, graphs and hash tables
web.engr.oregonstate.edu
—with a prescribed grading
distribution across assignments and exams
web.engr.oregonstate.edu
. These elements informed the
categories and rollups included in the template.
What the script does

Running create-fall-dashboard.js will:

    Create a master page titled “Fall 2025 Dashboard” under a parent
    page of your choosing. This top‑level page contains a heading and short
    description.

    Generate eight interconnected databases:
    Database	Purpose
    Courses	Stores each course’s name, code, credits, instructor,

                 meeting times, location, status and computed grades.            |

    | Assignments | Tracks homework, quizzes, exams, labs, projects and readings.
    Supports weighting, scores, due dates, status, priority and
    notes. A formula computes the weighted score for each item. |
    | Lectures | Captures lecture notes or topics by date and course, along
    with links to slides or resources. |
    | Study Sessions | Logs study activities by date, duration and type (e.g.
    lecture review, homework, exam prep). |
    | Resources | Catalogues textbooks, articles, videos, slides and websites
    linked to specific courses, with a completion checkbox. |
    | Quick Notes | A sticky‑notes database for capturing ideas, reminders,
    quotes or reflections. Includes tags and a completed flag. |
    | To‑Do | A simple task tracker for personal and school tasks that may
    not belong to a specific course. Supports categories,
    status, priority and due dates. |
    | Goals | Keeps track of academic, personal and career goals with
    target dates, progress percentages and notes. |

    Add relations and automation:

        A relation between Assignments and Courses allows you to select the
        course for each assignment. The reverse relation (“Assignments”) is
        automatically added to the Courses database.

        Two rollup properties on the Courses database—Total Weighted Score
        and Total Weight—sum the weighted scores and weights from all linked
        assignments. A Current Grade formula divides these sums, and a
        Letter Grade formula maps the numerical grade to a letter.

    Seed sample course entries for MTH 251Z, PH 211 and CS 261‑01 with
    placeholder instructors, times and locations. Each entry includes a
    paragraph summarising the course content (based on the official descriptions
    cited above) to remind you of the focus of each class.

Prerequisites

    Node.js installed on your machine.

    A Notion integration token and the ID of the parent page under which
    you want the dashboard to be created. Create an integration at
    notion.com/my-integrations, copy
    the secret and share your chosen parent page with the integration.

    A .env file in the root of this project containing:

    NOTION_TOKEN=your-secret
    NOTION_PARENT_PAGE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

Running the script

    Install dependencies if you haven’t already:

npm install @notionhq/client dotenv

Execute the script:

    node create-fall-dashboard.js

    It will print links to the new dashboard and log the creation of each
    database and sample course. Refresh your Notion workspace to see the
    “Fall 2025 Dashboard” under the specified parent page.

Customising the template

After running the script, open the Fall 2025 Dashboard and perform the
following adjustments to tailor the template to your schedule and preferences:

    Populate course details.

        Replace “TBA” with your instructors’ names, meeting times and classroom
        locations.

        Add syllabus links or files to the course pages. For example, attach your
        Calculus syllabus describing derivative applications and learning goals
        sites.science.oregonstate.edu
        , the Physics syllabus
        outlining classical mechanics and Newton’s laws
        sites.science.oregonstate.edu
        and the Data Structures overview
        specifying the data structures covered
        web.engr.oregonstate.edu
        .

    Create assignment templates. Within the Assignments database,
    create a template button (click New → Template) called “Homework” with
    default status Not Started, priority Medium and a checklist for
    problems. Create another template called “Exam” that sets the type to
    Exam, priority High and includes a revision checklist. Use the
    built‑in due date to schedule midterms and finals (for example, two midterms
    and a comprehensive final for calculus
    sites.science.oregonstate.edu
    or physics, and two midterms plus a
    final for data structures
    web.engr.oregonstate.edu
    ).

    Define assignment weights. Enter the percentage weight of each
    assignment relative to the final grade in the Weight column (e.g. 0.25
    for homework if your calculus syllabus allocates 25 points to homework and
    100 total
    sites.science.oregonstate.edu
    ). The Weighted Score formula will multiply the
    earned score by the weight, and the Current Grade rollup on the
    corresponding course will update automatically.

    Add lecture notes. Use the Lectures database to record lecture
    titles, dates and topics. You can attach links to slides or notes. For
    example, in physics you might note that a lecture covered motion in one and
    two dimensions and Newton’s laws
    sites.science.oregonstate.edu
    .

    Plan study sessions. Log each study block in the Study Sessions
    database. Choose a type such as “Exam Prep” or “Lecture Review”, note the
    duration in minutes and summarise what you accomplished. Over time, you
    can group the table by Type to analyse where you spend your study time.

    Curate resources. Add textbooks, articles or videos you want to
    reference in the Resources database. Use the Completed checkbox to
    track which materials you’ve read or watched. For example, list the
    recommended textbook Physics for Scientists & Engineers
    sites.science.oregonstate.edu
    or the data
    structures book and C reference recommended in the CS 261 syllabus
    web.engr.oregonstate.edu
    .

    Capture quick notes and reminders. The Quick Notes database is
    perfect for jotting down ideas, reminders or inspirational quotes that you
    encounter during your studies. Use tags like Idea, Reminder or
    Reflection and tick the Completed box when the note has served its
    purpose.

    Track personal to‑dos. Add non‑course tasks (e.g., errands, club
    obligations, household chores) to the To‑Do database. Assign a
    category such as School, Personal or Other and prioritise them so
    they don’t get lost among your assignments.

    Set and monitor goals. Use the Goals database to define short‑ and
    long‑term objectives. Assign each goal a category (academic, personal or
    career), choose a target date and update the progress percentage as you
    move closer to completion.

    Set up views. Notion allows you to create multiple views for each
    database. Suggested views include:

    Upcoming Assignments – filter for assignments with due dates within the
    next 7 days and sort by Due Date.

    Assignments by Course – group the assignments board by Course to see
    progress per subject.

    Study Calendar – display study sessions in a calendar view to visualise
    how you allocate your time.

    Resource Library – view resources as a gallery or table and group by
    Type.

    Automate progress tracking. You can extend the template with
    additional rollups or formulas. For example, add a rollup on the
    Courses database that counts assignments with status Completed, or a
    formula that converts the Current Grade into a percentage. Feel free
    to customise colours or add more status options.

Manual import alternative

If you prefer not to run the Node script, you can manually reproduce this
template in Notion. Use the table above as a blueprint for creating new
databases and properties (title, number, select, relation, rollup and formula).
Once the structure is in place, link your assignments, lectures, sessions and
resources to the appropriate course. The grade formulas described above can be
entered directly into a formula property.
License and attribution

This template is provided for personal use. It is inspired by course material
published by Oregon State University. Course descriptions and grading
information are summarised here for convenience and referenced via proper

