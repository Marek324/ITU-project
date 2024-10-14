function MainPageUser()
{
	let x = "penis"
	  return (
	<div className="MainPageUser">
	  <header className="MainPageUser-header">
		<Rectangle />
		<p>
			{x}
		</p>
	  </header>
	</div>
  );
}

function Rectangle() {
	return (
		<div className="w-full h-40 bg-Main_Header flex items-center justify-center border-2 border-Main_Header_Border">
			<h1 className="text-3xl font-Pet_Title text-border">Adopt & Play</h1>
		</div>
	);
}
export default MainPageUser;
