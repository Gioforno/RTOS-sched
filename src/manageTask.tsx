import { useState } from "react";
import "./manageTask.css";

type TaskErrors = {
  Name: string;
  Period: string;
  CPU_time: string;
  Arrival_Time: string;
  Deadline: string;
};

const AttrTask: (keyof TaskErrors)[] = [
  "Name",
  "Period",
  "CPU_time",
  "Arrival_Time",
  "Deadline",
];

type TaskProd = {
  Name: string;
  Period: number;
  CpuTime: number;
  ArrivalTime: number;
  Deadline: number;
};

type Props = {
  tasks: TaskProd[];
  setTask: React.Dispatch<React.SetStateAction<TaskProd[]>>;
};

export default function TableTask({ tasks, setTask }: Props) {
  const [isModalOpen, setModal] = useState(false);
  const [errors, setError] = useState<TaskErrors>({
    Name: "",
    Period: "",
    CPU_time: "",
    Arrival_Time: "",
    Deadline: "",
  });

  function addTask(formData: FormData) {
    const newTask: TaskProd = {
      Name: tasks.find((task) => task.Name === String(formData.get("Name")))
        ? ""
        : String(formData.get("Name")),
      Period:
        Number(formData.get("Period")) > -1
          ? Number(formData.get("Period"))
          : -1,
      CpuTime:
        Number(formData.get("CPU_time")) > 0
          ? Number(formData.get("CPU_time"))
          : -1,
      ArrivalTime:
        Number(formData.get("Arrival_Time")) > -1
          ? Number(formData.get("Arrival_Time"))
          : 0,
      Deadline:
        Number(formData.get("Deadline")) != 0
          ? Number(formData.get("Deadline"))
          : Number(formData.get("Period")),
    };

    const newError = {
      Name: newTask.Name == "" ? "Invalid Name" : "",
      Period: newTask.Period == -1 ? "Invalid Period" : "",
      CPU_time: newTask.CpuTime == -1 ? "Invalid CPU time" : "",
      Arrival_Time: newTask.ArrivalTime == -1 ? "Invalid Arrival Time" : "",
      Deadline: newTask.Deadline == -1 ? "Invalid Deadline" : "",
    };
    if (Object.values(newError).some((error) => error !== "")) {
      setError(newError);
    } else {
      setTask((tasks) => [...tasks, newTask]);
      closeTask();
    }
  }

  function delTask(nome: string) {
    setTask((tasks) => tasks.filter((task) => task.Name !== nome));
  }

  function handleTask() {
    setError({
      Name: "",
      Period: "",
      CPU_time: "",
      Arrival_Time: "",
      Deadline: "",
    });
    setModal(true);
  }

  function closeTask() {
    setModal(false);
  }

  return (
    <>
      <div className="task-panel-header">
        <h3 className="eyebrow-heading panel-title">Task set</h3>
        <button className="add-task-btn" onClick={handleTask}>
          Add new Task
        </button>
      </div>

      {isModalOpen && (
        <div id="windowTask" className="modal">
          <div id="modal-content">
            <span
              onClick={closeTask}
              style={{
                padding: 20,
                display: "block",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <button id="close" className="close">
                &times;
              </button>
            </span>

            <h4 className="eyebrow-heading">Add here a new task!</h4>
            <ul className="modal-hint">
              <li>set 0 period if aperiodic</li>
              <li>Priority is set by the algorithm you choose</li>
              <li>leave blank deadline if equal to period</li>
            </ul>
            <form action={addTask} className="task-form">
              {AttrTask.map((attr) => (
                <div className="field" key={attr}>
                  <label htmlFor={attr}>{attr.replace(/_/g, " ")}</label>
                  <input type="text" id={attr} name={attr} placeholder={attr} />
                  {errors[attr] && (
                    <p style={{ color: "red" }} role="alert">
                      {errors[attr]}
                    </p>
                  )}
                </div>
              ))}

              <button type="submit">add</button>
            </form>
          </div>
        </div>
      )}

      <table id="table" className="task-table">
        <caption>Table of task scheduled</caption>
        <thead>
          <tr>
            {AttrTask.map((attr) => (
              <th key={attr}>{attr}</th>
            ))}
            <th></th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.Name}>
              <td>{task.Name}</td>
              <td>{task.Period}</td>
              <td>{task.CpuTime}</td>
              <td>{task.ArrivalTime}</td>
              <td>{task.Deadline}</td>
              <td>
                <button className="del-btn" onClick={() => delTask(task.Name)}>
                  Del
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
