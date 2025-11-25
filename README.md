Part 1: Practical Coding 

Scenario: Build a Task Tracker web app using Laravel for the backend API and React for the frontend. 

Backend — Laravel 12 API 

 

• Create migrations for users and tasks (with fields id, user_id, title, status, due_date, etc.) 
• Create TaskController with REST API routes (/api/tasks) 
• Implement CRUD endpoints (GET, POST, PUT, DELETE) 
• Use TaskService class for business logic 
• Validate inputs using FormRequests 
• Use apiResource() routing 
• Seed sample data (5 users × 5 tasks) 
Bonus: Filtering by status/due_date, Sanctum authentication 

Frontend — React.js 

• Build with React + Vite (or CRA) 
• Pages/components: TaskList.jsx (list), TaskForm.jsx (form) 
• Use axios/fetch for API calls 
• Show status badges and handle loading/errors 
• Inline edit and delete options 
Bonus: Filtering, pagination, optimistic updates 

Submission Checklist 

Laravel backend on localhost:8000 
React frontend on localhost:3000 
CORS configured 
Clear README 
Git history shows progress 

Part 2 — Code Review & Debug 

A. Laravel Snippet 

public function store(Request $request) 
{ 
	$task = Task::create($request->all()); 
	return response()->json($task); 
} 

Questions: 
1. What issues do you see in this implementation? 
2. How would you improve it for security and maintainability? 

B. React Snippet 

function AddTask() { 
   const [title, setTitle] = useState(''); 
 
   const handleSubmit = (e) => { 
	axios.post('/api/tasks', { title }); 
   }; 
 
   return ( 
	<form onSubmit={handleSubmit}> 
   	<input value={title} onChange={e => setTitle(e.target.value)} /> 
   	<button>Add</button> 
	</form> 
   ); 
} 

Questions: 
1. Identify at least two issues in this code. 
2. Suggest improvements. 

Put answers in a part2.md file and include in the repository 

Part 3 — System Design 

Answer briefly in a file named DESIGN.md: 
1. How would you scale this app for 100k+ users? 
2. How would you implement background jobs (e.g., reminders)? 
3. How would you optimize database queries and caching? 
 

 

Submit this in a github repository and proceed to this form to share answers and further questions :https://forms.gle/MH91GyKp3gfGUSyY8 

 
