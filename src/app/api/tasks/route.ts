import { NextRequest, NextResponse } from 'next/server';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  createdAt: string;
  updatedAt: string;
}

// In-memory storage
let tasks: Task[] = [
  {
    id: '1',
    title: 'Setup project',
    description: 'Initialize the Next.js project with all dependencies',
    status: 'done',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Build API endpoints',
    description: 'Create CRUD APIs for tasks and comments',
    status: 'in-progress',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// GET all tasks
export async function GET() {
  return NextResponse.json({ tasks, success: true });
}

// POST create new task
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, status } = body;

    if (!title || !description) {
      return NextResponse.json(
        { error: 'Title and description are required', success: false },
        { status: 400 }
      );
    }

    const newTask: Task = {
      id: Date.now().toString(),
      title,
      description,
      status: status || 'todo',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    tasks.push(newTask);
    return NextResponse.json({ task: newTask, success: true }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body', success: false },
      { status: 400 }
    );
  }
}

// PUT update task
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, description, status } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Task ID is required', success: false },
        { status: 400 }
      );
    }

    const taskIndex = tasks.findIndex((task) => task.id === id);
    if (taskIndex === -1) {
      return NextResponse.json(
        { error: 'Task not found', success: false },
        { status: 404 }
      );
    }

    tasks[taskIndex] = {
      ...tasks[taskIndex],
      title: title ?? tasks[taskIndex].title,
      description: description ?? tasks[taskIndex].description,
      status: status ?? tasks[taskIndex].status,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({ task: tasks[taskIndex], success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body', success: false },
      { status: 400 }
    );
  }
}

// DELETE task
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Task ID is required', success: false },
        { status: 400 }
      );
    }

    const taskIndex = tasks.findIndex((task) => task.id === id);
    if (taskIndex === -1) {
      return NextResponse.json(
        { error: 'Task not found', success: false },
        { status: 404 }
      );
    }

    tasks.splice(taskIndex, 1);
    return NextResponse.json({ success: true, message: 'Task deleted' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request', success: false },
      { status: 400 }
    );
  }
}
