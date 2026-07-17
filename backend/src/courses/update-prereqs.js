const fs = require('fs');
const path = './courses-data.json';

const data = JSON.parse(fs.readFileSync(path, 'utf8'));

// Define the prerequisites
const prereqs = {
  'ศท142-1': ['ศท141-1'], // Eng 2 needs Eng 1
  'ศท241-4': ['ศท142-1'], // Eng Sci 1 needs Eng 2
  'ศท242-4': ['ศท241-4'], // Eng Sci 2 needs Eng Sci 1
  'คพ112-1': ['คพ111-1'], // CS 2 needs CS 1
  'คพ213-2': ['คพ112-1', 'คพ151-1'], // Algorithms needs CS 2 and Discrete
  'คพ252-1': ['คศ101-3'], // Math for CS needs Calc 1
  'คพ221-2': ['คพ112-1'], // Data Struct needs CS 2
  'คพ241-1': ['คพ112-1'], // Database needs CS 2
  'คพ222-2': ['คพ117-1'], // Multimedia needs OOP
  'คพ232-1': ['คพ121-1'], // Architecture needs Digital Logic
  'คพ313-3': ['คพ241-1'], // Web needs Database
  'คพ341-2': ['คพ241-1'], // Data Science needs Database
  'คพ343-3': ['คพ221-2'], // OOP Design needs Data Struct
  'คพ320-1': ['คพ232-1'], // OS needs Architecture
  'คพ344-2': ['คพ343-3'], // Software Dev needs OOP Design
  'คพ330-1': ['คพ232-1'], // Network needs Architecture
  'คพ347-1': ['คพ343-3'], // Software Eng needs OOP Design
  'คพ492-2': ['คพ347-1'], // Seminar needs Software Eng
  'วท497-1': ['คพ347-1'], // Co-op needs Software Eng
};

const updatedData = data.map(course => {
  if (prereqs[course.courseCode]) {
    course.prerequisites = prereqs[course.courseCode];
  }
  return course;
});

fs.writeFileSync(path, JSON.stringify(updatedData, null, 2));
console.log('Updated courses-data.json with prerequisites.');
