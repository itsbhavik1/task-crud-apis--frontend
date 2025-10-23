import { NextRequest, NextResponse } from 'next/server';

export interface Comment {
  id: string;
  taskId: string;
  text: string;
  author: string;
  createdAt: string;
  updatedAt: string;
}

// In-memory storage
let comments: Comment[] = [
  {
    id: '1',
    taskId: '1',
    text: 'Great job on setting up the project!',
    author: 'John Doe',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    taskId: '2',
    text: 'Make sure to include proper error handling',
    author: 'Jane Smith',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// GET all comments for a task
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  const { taskId } = await params;
  const taskComments = comments.filter((comment) => comment.taskId === taskId);
  return NextResponse.json({ comments: taskComments, success: true });
}

// POST create new comment
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const { taskId } = await params;
    const body = await request.json();
    const { text, author } = body;

    if (!text || !author) {
      return NextResponse.json(
        { error: 'Text and author are required', success: false },
        { status: 400 }
      );
    }

    const newComment: Comment = {
      id: Date.now().toString(),
      taskId,
      text,
      author,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    comments.push(newComment);
    return NextResponse.json({ comment: newComment, success: true }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body', success: false },
      { status: 400 }
    );
  }
}

// PUT update comment
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const { taskId } = await params;
    const body = await request.json();
    const { id, text, author } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Comment ID is required', success: false },
        { status: 400 }
      );
    }

    const commentIndex = comments.findIndex(
      (comment) => comment.id === id && comment.taskId === taskId
    );
    
    if (commentIndex === -1) {
      return NextResponse.json(
        { error: 'Comment not found', success: false },
        { status: 404 }
      );
    }

    comments[commentIndex] = {
      ...comments[commentIndex],
      text: text ?? comments[commentIndex].text,
      author: author ?? comments[commentIndex].author,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({ comment: comments[commentIndex], success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body', success: false },
      { status: 400 }
    );
  }
}

// DELETE comment
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const { taskId } = await params;
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Comment ID is required', success: false },
        { status: 400 }
      );
    }

    const commentIndex = comments.findIndex(
      (comment) => comment.id === id && comment.taskId === taskId
    );
    
    if (commentIndex === -1) {
      return NextResponse.json(
        { error: 'Comment not found', success: false },
        { status: 404 }
      );
    }

    comments.splice(commentIndex, 1);
    return NextResponse.json({ success: true, message: 'Comment deleted' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request', success: false },
      { status: 400 }
    );
  }
}
