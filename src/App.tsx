import "./App.css";
import { useEffect } from "react";
import * as signalR from "@microsoft/signalr";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import { Button } from "primereact/button";

function App() {
  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5221/register") // Connect to the SignalR hub endpoint
      .build();

    connection
      .start()
      .then(() => {
        console.log("SignalR Connected!");

        // Add the connection to users group

        connection.invoke("AddToGroup", "users");
        // listen to register Event from serer
        console.log("Client added to Group users!");

        connection.on("OnRegistration", (user: any, message: string) => {
          show(user.name);
          console.log(user);
          console.log(message);
        });
      })
      .catch((error: Error) => {
        console.error("SignalR Connection Error: ", error);
      });

    return () => {
      connection.stop();
    };
  }, []);

  const toast = useRef(null);
  const show = (user: any) => {
    (toast as any)?.current?.show({
      severity: "success",
      summary: "Success Message",
      detail: `${user} Registered Successfully`,
    });
  };

  return (
    <div>
      <Toast ref={toast} />
      <h1>Hello From SignalR Implementation</h1>
      <Button label="Click" onClick={show} />
    </div>
  );
}

export default App;
