import logo from './logo.svg';
import './App.css';
import MainPageController from "./Controller/MainPageController";
 let userMode = true;
function App() {
	if(userMode)
	{
		return (
			< MainPageController />
		);
	}
}

export default App;
