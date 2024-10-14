import logo from './logo.svg';
import './App.css';
import MainPageUser from "./MainPageUser";
 let userMode = true;
function App() {
	if(userMode)
	{
		return (
			< MainPageUser />
		);
	}
}

export default App;
