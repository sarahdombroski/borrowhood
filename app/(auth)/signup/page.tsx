export default function Signup() {
  return (
    <main>
      <div className="flex flex-col h-screen items-center justify-center border rounded-lg">
        <h1>Sign Up</h1>
        <input type="text" id="username" name="username" placeholder="username" className="border rounded-lg p-1"></input>
        <input type="text" id="password" name="password" placeholder="password" className="border rounded-lg p-1"></input>
        <button className="px-4 py-2 font-medium rounded-lg">Sign Up</button>
      </div>        
    </main>
  );
}
