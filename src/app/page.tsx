import { TaskManager } from '@/components/TaskManager';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, ListTodo, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold">Task Manager</h1>
            </div>
            <Button asChild variant="outline">
              <Link href="/api/tasks/test" target="_blank">
                Run API Tests
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold mb-4">Manage Your Tasks & Comments</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A complete task management system with full CRUD operations for tasks and comments.
            Built with Next.js 15, TypeScript, and Shadcn UI.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <ListTodo className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Task Management</CardTitle>
              <CardDescription>
                Create, read, update, and delete tasks with status tracking
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <MessageSquare className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Comments System</CardTitle>
              <CardDescription>
                Add comments to tasks with full CRUD capabilities
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CheckCircle2 className="h-10 w-10 text-primary mb-2" />
              <CardTitle>RESTful APIs</CardTitle>
              <CardDescription>
                Backend APIs with automated tests and proper error handling
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Main Task Manager */}
        <TaskManager />
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-12 border-t">
        <div className="text-center text-muted-foreground">
          <p className="mb-2">Built with Next.js 15, TypeScript, Shadcn UI, and Tailwind CSS</p>
          <p className="text-sm">
            API Endpoints: <code className="text-xs bg-muted px-2 py-1 rounded">/api/tasks</code> and{' '}
            <code className="text-xs bg-muted px-2 py-1 rounded">/api/tasks/[taskId]/comments</code>
          </p>
        </div>
      </footer>
    </div>
  );
}