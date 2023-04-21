import './App.css';
import React, { useState } from 'react';
var values = [];

  function App() {
  const [showComponentA, setShowComponentA] = useState(true);

  const toggleComponent = () => {
    setShowComponentA(!showComponentA);
  }

  return (
    <div>
      {showComponentA ? <ComponentA handleClick={toggleComponent}/> : <ComponentB handleClick={toggleComponent} />}
    </div>
  );
}


function ComponentA(props) {
  const [rows, setRows] = useState([
    { id: 1, col1: 'A', col2: '', col3: '3', col4: '2', col5: '1600', col6: '1600' },
    { id: 2, col1: 'B', col2: '', col3: '2', col4: '1', col5: '2700', col6: '2700' },
    { id: 3, col1: 'C', col2: '', col3: '11', col4: '10', col5: '300', col6: '600' },
    { id: 4, col1: 'D', col2: 'A', col3: '7', col4: '3', col5: '1300', col6: '1600' },
    { id: 5, col1: 'E', col2: 'B', col3: '6', col4: '3', col5: '850', col6: '1000' },
    { id: 6, col1: 'F', col2: 'C', col3: '2', col4: '1', col5: '4000', col6: '5000' },
    { id: 7, col1: 'G', col2: 'D,E', col3: '4', col4: '2', col5: '1500', col6: '2000' }
  ]);


  const handleAddRow = () => {
    const newId = rows.length + 1;
    setRows([...rows, { id: newId, col1: '', col2: '', col3: '', col4: '', col5: '', col6: '' }]);
  };

  const handleSubmit = (e) => {
    values = [];
    // Loop through the table rows and cells to access the input values
    const rows = document.querySelectorAll('tbody tr');
    rows.forEach(row => {
      const rowValues = [];
      const cells = row.querySelectorAll('td input');
      cells.forEach(cell => {
        rowValues.push(cell.value);
      });
      values.push(rowValues);
    });
  
    // Log the values to the console
    props.handleClick();
  }

 const handleDataChange = (id, col, value) => {
    setRows(rows.map(row => {
      if (row.id === id) {
        return { ...row, [col]: value };
      }
      return row;
    }));
  };

  
  return (
    <div>
      <div className='container'>
        <h1>How to use this app?</h1>
        <h3>Clear instruction:</h3>
        <p>
        <ol>
          <li>Input the names of the works. The MAX number of works is limited by the alphabet</li>
          <li>In the second column input the names of the works that should be done before this paticular one, if none - leave and empty space</li>
          <li>Input the rest of the data and press the button "Generate a response"</li>
        </ol>
        </p>
      </div>

      <table  id="rows">
      <thead>
        <tr>
          <th>Works (names)</th>
          <th>PreWorks (names)</th>
          <th>Usual schedule (days)</th>
          <th>Accelerated schedule (days)</th>
          <th>Usual price ($)</th>
          <th>Accelerated price ($)</th>
        </tr>
      </thead>
     <tbody>
        {rows.map(row => (
          <tr key={row.id}>
            <td><input value={row.col1} onChange={(e) => handleDataChange(row.id, 'col1', e.target.value)} /></td>
            <td><input value={row.col2} onChange={(e) => handleDataChange(row.id, 'col2', e.target.value)} /></td>
            <td><input value={row.col3} onChange={(e) => handleDataChange(row.id, 'col3', e.target.value)} /></td>
            <td><input value={row.col4} onChange={(e) => handleDataChange(row.id, 'col4', e.target.value)} /></td>
            <td><input value={row.col5} onChange={(e) => handleDataChange(row.id, 'col5', e.target.value)} /></td>
            <td><input value={row.col6} onChange={(e) => handleDataChange(row.id, 'col6', e.target.value)} /></td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <td colSpan="3">
            <button onClick={handleAddRow}  className="button-64" role="button"><span className="text">Add a row</span></button>
          </td>
          <td colSpan="3">
            <button className="button-64" role="button" onClick={handleSubmit}><span className="text">Generate a response</span></button>
          </td>
        </tr>
      </tfoot>
    </table>
    </div>
  );
}

function ComponentB(props) {
      console.log(values);
       const calcUsualPrice = () => {
        var res = 0;
        for(var i = 0; i < values.length; i++) {
          res +=parseInt(values[i][4]);
        }
        return res;
       }
       const [price, setPrice] = useState(calcUsualPrice());
       
// sample input
const tasks = [];
for(var i = 0; i < values.length; i++) {
  var task1 = {
    name:values[i][0],
    duration: parseInt(values[i][2]),
    dependencies:[]
  }
  if (values[i][1] !=="") {
    task1.dependencies = values[i][1].split(",");
  }
  tasks.push(task1);
}
console.log(tasks);



//Calculate the ES, EF, LS, and LF for each task
function calculateES(tasks) {
  // Initialize ES for all tasks to 0
  var a = 0;
  while (tasks[a].dependencies.length === 0) {
    tasks[a].es = 0;
    tasks[a].ef = tasks[a].duration;
    a++;
  }
  while (a < tasks.length) {
    if(tasks[a].dependencies.length == 1) {
      var name = tasks[a].dependencies[0];
      const result = tasks.find(obj => obj.name === name);
      tasks[a].es = result.ef;
      tasks[a].ef = result.ef + tasks[a].duration;
    } else {
      var newArr = [];
      var newArr1 = [];
      for(const dep of tasks[a].dependencies) {
        newArr.push(tasks.find(obj => obj.name === dep));
      }
      for(const dep1 of newArr) {
        newArr1.push(dep1.ef);
      }
      tasks[a].es = Math.max(...newArr1);
      tasks[a].ef = tasks[a].es + tasks[a].duration;
    }
    a++;
  }

  }

function findProjectDuration(tasks) {
  // Find the maximum EF value among all tasks
  let maxEF = 0;
  for (const task of tasks) {
    if (task.ef > maxEF) {
      maxEF = task.ef;
    }
  }
  return maxEF;
}



function getSuccessors(task, tasks) {
  let successors = [];
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].dependencies.includes(task.name)) {
      successors.push(tasks[i]);
    }
  }
  return successors;
}


function calculateLateFinish(tasks) {
  var a = tasks.length-1;
  while (getSuccessors(tasks[a], tasks).length === 0) {
    tasks[a].lf = findProjectDuration(tasks);
    tasks[a].ls = tasks[a].lf - tasks[a].duration;
    a--;
  }
  while (a >= 0) {
    if(getSuccessors(tasks[a], tasks).length == 1) {
      var name = getSuccessors(tasks[a], tasks)[0];
      console.log(name);
      tasks[a].lf = name.ls;
      tasks[a].ls = name.ls - tasks[a].duration;
    } else {
      var newArr1 = [];
      for(const dep1 of getSuccessors(tasks[a], tasks)) {
        newArr1.push(dep1.ls);
      }
      tasks[a].lf = Math.min(...newArr1);
      tasks[a].ls = tasks[a].lf - tasks[a].duration;
    }
    a--;
  }
}



function calculatePath(tasks) {
  var path = "";
  for(const task of tasks) {
    if (task.ls==task.es) {
      path = path + task.name + "-";
    }
  }
  return path.slice(0, -1);
}


calculateES(tasks);
//calculateLateStart(tasks, findProjectDuration(tasks));
calculateLateFinish(tasks);

const [path, setPath] = useState(calculatePath(tasks));

const handleSubmit = (e) => {
  // Log the values to the console
  props.handleClick();
}
const [placeholder, setPlaceholder] = useState([]);
const handleImprove = (e) => {
  let arr = path.split("-");
  let arrayOf = [];
  let arrOfWorks =[];
  for(let i = 0; i<arr.length;i++) {
    for(let j = 0; j<values.length; j++) {
      if(values[j][0]===arr[i]) {
        arrayOf.push(values[j]);
      }
    }
  }
  for(let i = 0; i< arrayOf.length; i++) {
    let res2 = (parseInt(arrayOf[i][5])-parseInt(arrayOf[i][4]))/(parseInt(arrayOf[i][2])-parseInt(arrayOf[i][3]));
    if (res2===0) {
      arrOfWorks.push(Number.MAX_SAFE_INTEGER);
    } else {
      arrOfWorks.push(res2);
    }
    
  }
  let minV = Math.min(...arrOfWorks);
  let index = 0;
  for(let i = 0; i < arrOfWorks.length; i++) {
    if(arrOfWorks[i]===minV) {
      index = i;
    }
  }
  console.log(arrOfWorks);
  console.log(minV);
  console.log(index);
  setPlaceholder([arrayOf[index][0], (parseInt(arrayOf[index][2])-parseInt(arrayOf[index][3])), (parseInt(arrayOf[index][5])-parseInt(arrayOf[index][4]))]);
  console.log(placeholder);
}

/*const setToZero = () => {
  var a = tasks.length-1;
  while (getSuccessors(tasks[a], tasks).length === 0) {
    tasks[a].lf = findProjectDuration(tasks);
    tasks[a].ls = tasks[a].lf - tasks[a].duration;
    a--;
  }
  a = 0;
  while (tasks[a].dependencies.length === 0) {
    tasks[a].es = 0;
    tasks[a].ef = tasks[a].duration;
    a++;
  }
}

const handleDiffer = (e) => {
    for(let j = 0; j<tasks.length; j++) {
      if(tasks[j].name===placeholder[0]) {
        tasks[j].duration = values[j][3];
        values[j][4] = values[j][5];
      }
    }
  setToZero();
  calculateES(tasks);
  calculateLateFinish(tasks);
  setprojDur(findProjectDuration(tasks));
  setPrice(calcUsualPrice());
  setPath(calculatePath(tasks));
  console.log(tasks);
}*/

  return ( <div>
      <div className='container'>
        <h1>How to use this app?</h1>
        <h3>Clear instruction:</h3>
        <p>
        <ol>
          <li>Input the names of the works. The MAX number of works is limited by the alphabet</li>
          <li>In the second column input the names of the works that should be done before this paticular one, if none - leave and empty space</li>
          <li>Input the rest of the data and press the button "Generate a response"</li>
        </ol>
        </p>
      </div>
      <div>
        <table id="result">
          <thead>
            <tr>
              <th>Name of the parameter</th>
              <th>Result of calculations</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Critical events:</td>
              <td>{path.replace(/-/g, ", ")}</td>
            </tr>
            <tr>
              <td>Critical Path:</td>
              <td>{path}</td>
            </tr>
            <tr>
              <td>Time:</td>
              <td>{findProjectDuration(tasks) + " days"}</td>
            </tr>
            <tr>
              <td>Price:</td>
              <td>{price + "$"}</td>
            </tr>
            <tr>
              <td>Further improvement</td>
              <td><p>The most effective by cost/effect ratio move is to use accelerated time for task:  {placeholder[0]} </p>
                  <p>It will decrease the time for the project by: {placeholder[1]} days (if the critical path does not change)</p>
                  <p>And will increase the cost by: {placeholder[2]} $</p></td>
            </tr>
            <tr>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td><button className="button-64" role="button" onClick={handleSubmit}><span className="text">Go back</span></button></td>
              <td><button className="button-64" role="button" onClick={handleImprove}><span className="text">Check</span></button>
                
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      <footer>Developed by Andrew Kirsanov 341 group Kherson State University</footer>
  </div>);
}
//<button className="button-64" role="button" onClick={handleDiffer}><span className="text">Imrove</span></button>

export default App;
