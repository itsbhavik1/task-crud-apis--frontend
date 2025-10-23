import { NextResponse } from 'next/server';

interface TestResult {
  test: string;
  passed: boolean;
  message: string;
  statusCode?: number;
  data?: any;
}

// Automated test suite for all APIs
export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const results: TestResult[] = [];

  try {
    // Test 1: GET all tasks
    const getTasks = await fetch(`${baseUrl}/api/tasks`, { cache: 'no-store' });
    const getTasksData = await getTasks.json();
    results.push({
      test: 'GET /api/tasks',
      passed: getTasks.ok && getTasksData.success,
      message: getTasks.ok ? 'Successfully retrieved tasks' : 'Failed to get tasks',
      statusCode: getTasks.status,
      data: getTasksData,
    });

    // Test 2: POST create new task
    const newTask = {
      title: 'Test Task',
      description: 'This is a test task',
      status: 'todo',
    };
    const postTask = await fetch(`${baseUrl}/api/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTask),
      cache: 'no-store',
    });
    const postTaskData = await postTask.json();
    const createdTaskId = postTaskData.task?.id;
    results.push({
      test: 'POST /api/tasks',
      passed: postTask.status === 201 && postTaskData.success,
      message: postTask.ok ? 'Successfully created task' : 'Failed to create task',
      statusCode: postTask.status,
      data: postTaskData,
    });

    // Test 3: PUT update task
    if (createdTaskId) {
      const updateTask = {
        id: createdTaskId,
        title: 'Updated Test Task',
        description: 'This task has been updated',
        status: 'in-progress',
      };
      const putTask = await fetch(`${baseUrl}/api/tasks`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateTask),
        cache: 'no-store',
      });
      const putTaskData = await putTask.json();
      results.push({
        test: 'PUT /api/tasks',
        passed: putTask.ok && putTaskData.success,
        message: putTask.ok ? 'Successfully updated task' : 'Failed to update task',
        statusCode: putTask.status,
        data: putTaskData,
      });
    }

    // Test 4: POST create comment
    const newComment = {
      text: 'Test comment',
      author: 'Test User',
    };
    const postComment = await fetch(`${baseUrl}/api/tasks/1/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newComment),
      cache: 'no-store',
    });
    const postCommentData = await postComment.json();
    const createdCommentId = postCommentData.comment?.id;
    results.push({
      test: 'POST /api/tasks/[taskId]/comments',
      passed: postComment.status === 201 && postCommentData.success,
      message: postComment.ok ? 'Successfully created comment' : 'Failed to create comment',
      statusCode: postComment.status,
      data: postCommentData,
    });

    // Test 5: GET comments for task
    const getComments = await fetch(`${baseUrl}/api/tasks/1/comments`, { cache: 'no-store' });
    const getCommentsData = await getComments.json();
    results.push({
      test: 'GET /api/tasks/[taskId]/comments',
      passed: getComments.ok && getCommentsData.success,
      message: getComments.ok ? 'Successfully retrieved comments' : 'Failed to get comments',
      statusCode: getComments.status,
      data: getCommentsData,
    });

    // Test 6: PUT update comment
    if (createdCommentId) {
      const updateComment = {
        id: createdCommentId,
        text: 'Updated test comment',
        author: 'Test User Updated',
      };
      const putComment = await fetch(`${baseUrl}/api/tasks/1/comments`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateComment),
        cache: 'no-store',
      });
      const putCommentData = await putComment.json();
      results.push({
        test: 'PUT /api/tasks/[taskId]/comments',
        passed: putComment.ok && putCommentData.success,
        message: putComment.ok ? 'Successfully updated comment' : 'Failed to update comment',
        statusCode: putComment.status,
        data: putCommentData,
      });
    }

    // Test 7: DELETE comment
    if (createdCommentId) {
      const deleteComment = await fetch(
        `${baseUrl}/api/tasks/1/comments?id=${createdCommentId}`,
        { method: 'DELETE', cache: 'no-store' }
      );
      const deleteCommentData = await deleteComment.json();
      results.push({
        test: 'DELETE /api/tasks/[taskId]/comments',
        passed: deleteComment.ok && deleteCommentData.success,
        message: deleteComment.ok ? 'Successfully deleted comment' : 'Failed to delete comment',
        statusCode: deleteComment.status,
        data: deleteCommentData,
      });
    }

    // Test 8: DELETE task
    if (createdTaskId) {
      const deleteTask = await fetch(`${baseUrl}/api/tasks?id=${createdTaskId}`, {
        method: 'DELETE',
        cache: 'no-store',
      });
      const deleteTaskData = await deleteTask.json();
      results.push({
        test: 'DELETE /api/tasks',
        passed: deleteTask.ok && deleteTaskData.success,
        message: deleteTask.ok ? 'Successfully deleted task' : 'Failed to delete task',
        statusCode: deleteTask.status,
        data: deleteTaskData,
      });
    }

    // Test 9: Error handling - Missing required fields
    const invalidTask = await fetch(`${baseUrl}/api/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'No description' }),
      cache: 'no-store',
    });
    const invalidTaskData = await invalidTask.json();
    results.push({
      test: 'Error Handling - Missing required fields',
      passed: invalidTask.status === 400 && !invalidTaskData.success,
      message: invalidTask.status === 400 ? 'Correctly rejected invalid data' : 'Failed to validate',
      statusCode: invalidTask.status,
      data: invalidTaskData,
    });

    // Test 10: Error handling - Non-existent resource
    const notFoundTask = await fetch(`${baseUrl}/api/tasks?id=nonexistent`, {
      method: 'DELETE',
      cache: 'no-store',
    });
    const notFoundTaskData = await notFoundTask.json();
    results.push({
      test: 'Error Handling - Non-existent resource',
      passed: notFoundTask.status === 404 && !notFoundTaskData.success,
      message: notFoundTask.status === 404 ? 'Correctly returned 404' : 'Failed to handle not found',
      statusCode: notFoundTask.status,
      data: notFoundTaskData,
    });

    const passedTests = results.filter((r) => r.passed).length;
    const totalTests = results.length;

    return NextResponse.json({
      success: true,
      summary: {
        total: totalTests,
        passed: passedTests,
        failed: totalTests - passedTests,
        passRate: `${((passedTests / totalTests) * 100).toFixed(1)}%`,
      },
      results,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: 'Test execution failed',
      message: error.message,
      results,
    }, { status: 500 });
  }
}
