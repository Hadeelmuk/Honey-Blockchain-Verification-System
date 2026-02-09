"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  Flower2,
  User,
  ArrowRight,
  Eye,
  AlertCircle,
} from "lucide-react";

interface HoneyBatch {
  batch_id: string;
  beekeeper_name: string;
  region: string;
  flower_type: string;
  harvest_date: string;
  description: string;
  qr_code_url: string;
  created_at: string;
}

interface PaginationInfo {
  total: number;
  limit: number;
  offset: number;
}

// All available regions from the Add Honey page
const allRegions = [
  "Sana'a, Yemen",
  "Aden, Yemen",
  "Taiz, Yemen",
  "Ibb, Yemen",
  "Hodeidah, Yemen",
  "Hadramout, Yemen",
  "Socotra, Yemen",
  "California, USA",
  "New Zealand",
  "Australia",
  "Mediterranean Region",
  "Other",
];

// All available flower types from the Add Honey page
const allFlowerTypes = [
  "sidr",
  "acacia", 
  "wildflower",
  "orange-blossom",
  "mountain-herbs",
  "manuka",
  "lavender",
  "clover",
  "other",
];

export default function BrowsePage() {
  const [honeyBatches, setHoneyBatches] = useState<HoneyBatch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    limit: 12,
    offset: 0,
  });

  // Filter states
  const [flowerType, setFlowerType] = useState("");
  const [region, setRegion] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch honey batches
  const fetchHoneyBatches = async () => {
    setIsLoading(true);
    setError("");

    try {
      let url = `/api/honey?listAll=true&limit=${pagination.limit}&offset=${pagination.offset}`;

      // Only add filters if they're not "any" or empty
      if (flowerType && flowerType !== "any") {
        url += `&flowerType=${encodeURIComponent(flowerType)}`;
      }

      if (region && region !== "any") {
        url += `&region=${encodeURIComponent(region)}`;
      }

      // Add search term if provided
      if (searchTerm && searchTerm.trim()) {
        url += `&search=${encodeURIComponent(searchTerm.trim())}`;
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to fetch honey batches");
      }

      const data = await response.json();

      if (data.success) {
        setHoneyBatches(data.data);
        setPagination(data.pagination);
      } else {
        throw new Error(data.error || "Failed to fetch honey batches");
      }
    } catch (err) {
      console.error("Error fetching honey batches:", err);
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchHoneyBatches();
  }, [pagination.offset]); // Only trigger on pagination changes, not filter changes

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm && searchTerm.trim()) {
        // Reset pagination when searching
        setPagination((prev) => ({ ...prev, offset: 0 }));
        // Apply search immediately
        fetchHoneyBatches();
      }
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Auto-refresh when all filters are reset
  useEffect(() => {
    // If all filters are empty/any, refresh the data
    if ((!flowerType || flowerType === "any") && 
        (!region || region === "any") && 
        (!searchTerm || searchTerm.trim() === "")) {
      fetchHoneyBatches();
    }
  }, [flowerType, region]);

  // Handle pagination
  const handlePageChange = (newOffset: number) => {
    setPagination((prev) => ({ ...prev, offset: newOffset }));
  };

  // Handle filter changes
  const applyFilters = () => {
    // Reset pagination when applying new filters
    setPagination((prev) => ({ ...prev, offset: 0 }));
    // Trigger a new search with current filters
    fetchHoneyBatches();
  };

  // Reset all filters
  const resetFilters = () => {
    // Reset all filter states
    setFlowerType("");
    setRegion("");
    setSearchTerm("");
    setPagination((prev) => ({ ...prev, offset: 0 }));
  };

  // Filter batches by search term (client-side filtering for immediate feedback)
  // Note: The Apply Filters button will trigger a fresh API call with all filters
  const filteredBatches = searchTerm && searchTerm.trim()
    ? honeyBatches.filter(
        (batch) => {
          const matches = [];
          if (batch.batch_id.toLowerCase().includes(searchTerm.toLowerCase())) matches.push('batch_id');
          if (batch.beekeeper_name.toLowerCase().includes(searchTerm.toLowerCase())) matches.push('beekeeper_name');
          if (batch.description.toLowerCase().includes(searchTerm.toLowerCase())) matches.push('description');
          if (batch.flower_type.toLowerCase().includes(searchTerm.toLowerCase())) matches.push('flower_type');
          if (batch.region.toLowerCase().includes(searchTerm.toLowerCase())) matches.push('region');
          
          // Log search matches for debugging
          if (matches.length > 0) {
            console.log(`Search "${searchTerm}" matched in ${matches.join(', ')} for batch ${batch.batch_id}`);
          }
          
          return matches.length > 0;
        }
      )
    : honeyBatches;

  // Calculate total pages
  const totalPages = Math.ceil(pagination.total / pagination.limit);
  const currentPage = Math.floor(pagination.offset / pagination.limit) + 1;

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if there are few
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Calculate start and end of visible pages
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      // Adjust if we're near the beginning or end
      if (currentPage <= 2) {
        end = Math.min(totalPages - 1, 4);
      } else if (currentPage >= totalPages - 1) {
        start = Math.max(2, totalPages - 3);
      }

      // Add ellipsis if needed
      if (start > 2) {
        pages.push("ellipsis");
      }

      // Add middle pages
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Add ellipsis if needed
      if (end < totalPages - 1) {
        pages.push("ellipsis");
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-1 bg-amber-500 rounded-full"></div>
              <span className="mx-4 text-amber-600 font-semibold">
                VERIFIED HONEY BATCHES
              </span>
              <div className="w-16 h-1 bg-amber-500 rounded-full"></div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Browse Verified Honey Batches
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Explore our database of blockchain-verified honey batches. Each
              batch has been recorded by beekeepers and verified for
              authenticity.
            </p>
          </div>

          {/* Filters */}
          <Card className="mb-8 shadow-md">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Filter className="h-5 w-5 text-amber-600" />
                Filter Honey Batches
              </CardTitle>
              <CardDescription>
                Narrow down your search using the filters below. Search works across batch ID, beekeeper name, flower type, region, and description.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                {/* Search */}
                <div>
                  <Label htmlFor="search" className="mb-2 block">
                    Search
                  </Label>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      id="search"
                      placeholder="Search by ID, beekeeper, flower type, region, or description"
                      className="pl-9"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && searchTerm.trim() && (
                      <p className="text-xs text-gray-500 mt-1">
                        Searching for "{searchTerm}" across all fields...
                      </p>
                    )}
                  </div>
                </div>

                {/* Flower Type Filter */}
                <div>
                  <Label htmlFor="flowerType" className="mb-2 block">
                    Flower Type
                  </Label>
                  <Select value={flowerType} onValueChange={setFlowerType}>
                    <SelectTrigger id="flowerType">
                      <SelectValue placeholder="All Flower Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">All Flower Types</SelectItem>
                      {allFlowerTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Region Filter */}
                <div>
                  <Label htmlFor="region" className="mb-2 block">
                    Region
                  </Label>
                  <Select value={region} onValueChange={setRegion}>
                    <SelectTrigger id="region">
                      <SelectValue placeholder="All Regions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">All Regions</SelectItem>
                      {allRegions.map((reg) => (
                        <SelectItem key={reg} value={reg}>
                          {reg}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={resetFilters}>
                Reset Filters
              </Button>
              <Button
                className="bg-amber-600 hover:bg-amber-700"
                onClick={applyFilters}
              >
                Apply Filters
              </Button>
            </CardFooter>
          </Card>

          {/* Error Message */}
          {error && (
            <div className="mb-8 p-4 border border-red-200 bg-red-50 rounded-lg flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-800">
                  Error Loading Honey Batches
                </h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* Results Count */}
          <div className="mb-6 flex justify-between items-center">
            <div className="text-gray-600">
              {isLoading ? (
                <Skeleton className="h-6 w-48" />
              ) : (
                <div>
                  {searchTerm && searchTerm.trim() ? (
                    <div>
                      <span>Showing {filteredBatches.length} of {honeyBatches.length} honey batches (Search: "{searchTerm}")</span>
                      {filteredBatches.length > 0 && (
                        <div className="text-sm text-amber-600 mt-1">
                          Found matches in: {filteredBatches.map(batch => {
                            const matches = [];
                            if (batch.batch_id.toLowerCase().includes(searchTerm.toLowerCase())) matches.push('Batch ID');
                            if (batch.beekeeper_name.toLowerCase().includes(searchTerm.toLowerCase())) matches.push('Beekeeper');
                            if (batch.flower_type.toLowerCase().includes(searchTerm.toLowerCase())) matches.push('Flower Type');
                            if (batch.region.toLowerCase().includes(searchTerm.toLowerCase())) matches.push('Region');
                            if (batch.description.toLowerCase().includes(searchTerm.toLowerCase())) matches.push('Description');
                            return matches.join(', ');
                          }).join(' | ')}
                        </div>
                      )}
                    </div>
                  ) : (
                    <span>Showing {filteredBatches.length} of {pagination.total} honey batches</span>
                  )}
                  {(flowerType && flowerType !== "any") || (region && region !== "any") || (searchTerm && searchTerm.trim()) ? (
                    <span className="ml-2 text-amber-600 font-medium">
                      (Filters applied)
                    </span>
                  ) : null}
                </div>
              )}
            </div>
            <Link href="/verify">
              <Button
                variant="outline"
                size="sm"
                className="text-amber-600 border-amber-600"
              >
                Verify a Specific Batch
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Honey Batches Grid */}
          {isLoading ? (
            // Loading skeletons
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="shadow-md overflow-hidden">
                  <div className="h-40 bg-amber-100">
                    <Skeleton className="h-full w-full" />
                  </div>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-10 w-full" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : filteredBatches.length > 0 ? (
            // Honey batches grid
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {filteredBatches.map((batch) => (
                <Card
                  key={batch.batch_id}
                  className="shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  <div className="h-40 bg-gradient-to-r from-amber-100 to-amber-200 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-amber-800">
                        {batch.flower_type.charAt(0).toUpperCase() + batch.flower_type.slice(1).replace('-', ' ')}
                      </div>
                      <div className="text-amber-600">Honey</div>
                    </div>
                  </div>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl">
                        {batch.beekeeper_name}'s Honey
                      </CardTitle>
                      <Badge className="bg-amber-600">{batch.batch_id}</Badge>
                    </div>
                    <CardDescription>
                      Harvested on{" "}
                      {new Date(batch.harvest_date).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span>
                          <strong>Beekeeper:</strong> {batch.beekeeper_name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Flower2 className="h-4 w-4 text-gray-500" />
                        <span>
                          <strong>Flower Type:</strong> {batch.flower_type.charAt(0).toUpperCase() + batch.flower_type.slice(1).replace('-', ' ')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span>
                          <strong>Region:</strong> {batch.region}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>
                          <strong>Harvest Date:</strong>{" "}
                          {new Date(batch.harvest_date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Link
                      href={`/verify?id=${batch.batch_id}`}
                      className="w-full"
                    >
                      <Button className="w-full bg-amber-600 hover:bg-amber-700">
                        <Eye className="mr-2 h-4 w-4" />
                        View Details & Verify
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            // No results
            <Card className="shadow-md mb-8 p-8 text-center">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">
                No Honey Batches Found
              </h3>
              <p className="text-gray-600 mb-6">
                We couldn't find any honey batches matching your filters. Try
                adjusting your search criteria or adding a new honey batch.
              </p>
              <div className="flex justify-center gap-4">
                <Button variant="outline" onClick={resetFilters}>
                  Reset Filters
                </Button>
                <Link href="/add">
                  <Button className="bg-amber-600 hover:bg-amber-700">
                    Add New Honey Batch
                  </Button>
                </Link>
              </div>
            </Card>
          )}

          {/* Pagination */}
          {!isLoading && filteredBatches.length > 0 && totalPages > 1 && (
            <Pagination className="my-8">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (pagination.offset >= pagination.limit) {
                        handlePageChange(pagination.offset - pagination.limit);
                      }
                    }}
                    className={
                      pagination.offset === 0
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>

                {getPageNumbers().map((page, index) => (
                  <PaginationItem key={index}>
                    {page === "ellipsis" ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(
                            (Number(page) - 1) * pagination.limit
                          );
                        }}
                        isActive={currentPage === page}
                      >
                        {page}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (
                        pagination.offset + pagination.limit <
                        pagination.total
                      ) {
                        handlePageChange(pagination.offset + pagination.limit);
                      }
                    }}
                    className={
                      pagination.offset + pagination.limit >= pagination.total
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}

          {/* Call to Action */}
          <Card className="shadow-md bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200 mt-12">
            <CardContent className="pt-6 pb-6">
              <div className="grid md:grid-cols-2 gap-6 items-center">
                <div>
                  <h3 className="text-2xl font-bold text-amber-800 mb-2">
                    Are You a Beekeeper?
                  </h3>
                  <p className="text-amber-700 mb-4">
                    Record your honey batches on the blockchain to provide
                    transparency and authenticity to your customers.
                  </p>
                  <Link href="/add">
                    <Button className="bg-amber-600 hover:bg-amber-700">
                      Record New Honey Batch
                    </Button>
                  </Link>
                </div>
                <div className="text-center">
                  <div className="text-6xl">🐝</div>
                  <p className="text-amber-600 mt-2">
                    Join our community of transparent beekeepers
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Metadata is now in a separate file: metadata.ts
