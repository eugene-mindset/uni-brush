import "@/styles/ui.css";

export const MainMenu = () => {
  const onSaveClick = async () => {
    const filePath = await window.ipcRenderer.invoke("dialog:saveFile");
    console.log(filePath);
  };

  return (
    <div>
      <button>Load</button>
      <button onClick={onSaveClick}>Save</button>
    </div>
  );
};

export default MainMenu;
