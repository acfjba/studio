'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Filter } from 'lucide-react';
import { bookData as initialBookData } from '@/lib/data';

export function LibraryClient() {
  const [bookData, setBookData] = useState(initialBookData);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [genreFilter, setGenreFilter] = useState<string[]>([]);

  const genres = [...new Set(initialBookData.map((b) => b.genre))];
  const statuses = [...new Set(initialBookData.map((b) => b.status))];

  const filteredData = bookData.filter(
    (book) =>
      (book.title.toLowerCase().includes(search.toLowerCase()) ||
       book.author.toLowerCase().includes(search.toLowerCase())) &&
      (statusFilter.length === 0 || statusFilter.includes(book.status)) &&
      (genreFilter.length === 0 || genreFilter.includes(book.genre))
  );
  
  const statusVariants: { [key: string]: 'default' | 'secondary' | 'destructive' | 'outline' } = {
    'Available': 'default',
    'Checked Out': 'secondary',
    'Overdue': 'destructive',
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Book Collection</CardTitle>
        <CardDescription>A list of all books in your school's library.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 mb-4">
          <Input
            placeholder="Search by title or author..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
          <div className="ml-auto flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" /> Genre
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by Genre</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {genres.map((genre) => (
                  <DropdownMenuCheckboxItem
                    key={genre}
                    checked={genreFilter.includes(genre)}
                    onCheckedChange={(checked) =>
                      setGenreFilter((prev) =>
                        checked ? [...prev, genre] : prev.filter((g) => g !== genre)
                      )
                    }
                  >
                    {genre}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" /> Status
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {statuses.map((status) => (
                  <DropdownMenuCheckboxItem
                    key={status}
                    checked={statusFilter.includes(status)}
                    onCheckedChange={(checked) =>
                      setStatusFilter((prev) =>
                        checked ? [...prev, status] : prev.filter((s) => s !== status)
                      )
                    }
                  >
                    {status}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Genre</TableHead>
                <TableHead>Status</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((book) => (
                <TableRow key={book.id}>
                  <TableCell className="font-medium">{book.title}</TableCell>
                  <TableCell>{book.author}</TableCell>
                  <TableCell>{book.genre}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariants[book.status] || 'outline'}>{book.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Manage Loan</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
