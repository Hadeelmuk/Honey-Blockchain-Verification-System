"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Eye } from "lucide-react";
import Link from "next/link";

interface HoneyProduct {
  id: string;
  name: string;
  batchId: string;
  flowerType: string;
  region: string;
  beekeeper: string;
  harvestDate: string;
  imageUrl: string;
}

const honeyProducts: HoneyProduct[] = [
  {
    id: "1",
    name: "ORGANIC WILDFLOWER HONEY",
    batchId: "HNY2024-001",
    flowerType: "Wildflower",
    region: "Yemen Highlands",
    beekeeper: "Ahmad Bee Farm",
    harvestDate: "May 2024",
    imageUrl: "/images/honey-jar4.png",
  },
  {
    id: "2",
    name: "MONALISA PURE NATURAL HONEY",
    batchId: "HNY2024-002",
    flowerType: "Mixed Flowers",
    region: "Yemen Valley",
    beekeeper: "BeeHarmony Co.",
    harvestDate: "April 2024",
    imageUrl: "/images/honey-jar-1.png",
  },
  {
    id: "3",
    name: "ACACIA HONEY",
    batchId: "HNY2024-003",
    flowerType: "Acacia",
    region: "Yemen Mountains",
    beekeeper: "Forest Gold Apiaries",
    harvestDate: "June 2024",
    imageUrl: "/images/honey-jar-3.png",
  },
  {
    id: "4",
    name: "HONEY TONE",
    batchId: "HNY2024-004",
    flowerType: "Dark Amber",
    region: "Yemen Plains",
    beekeeper: "BeeHarmony Co.",
    harvestDate: "May 2024",
    imageUrl: "/images/honeu-jar-2.png",
  },
];

export function HoneyProducts() {
  return (
    <section className="py-24 bg-gradient-to-br from-amber-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-1 bg-amber-500 rounded-full"></div>
            <span className="mx-4 text-amber-600 font-semibold">
              TRACEABLE HONEY BATCHES
            </span>
            <div className="w-16 h-1 bg-amber-500 rounded-full"></div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Traceable Honey Batches
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Every jar has a story. Scan, verify, and trust your honey source.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {honeyProducts.map((product) => (
            <Card
              key={product.id}
              className="shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-white/90 backdrop-blur-sm"
            >
              <CardHeader className="p-0">
                <div className="relative">
                  <div className="w-full h-48 bg-gradient-to-b from-amber-100 to-amber-200 rounded-t-lg overflow-hidden">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover rounded-t-lg"
                      style={{
                        objectPosition: "center",
                      }}
                    />
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                <div className="mb-4">
                  <h3 className="font-bold text-lg text-gray-800 mb-2">
                    Batch ID: {product.batchId}
                  </h3>
                </div>

                <div className="space-y-2 text-sm text-gray-600 mb-6">
                  <div className="flex justify-between">
                    <span className="font-medium">Flower Type:</span>
                    <span>{product.flowerType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Region:</span>
                    <span>{product.region}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Beekeeper:</span>
                    <span>{product.beekeeper}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Harvest Date:</span>
                    <span>{product.harvestDate}</span>
                  </div>
                </div>

                <Link href={`/verify?batch=${product.batchId}`}>
                  <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white">
                    <Search className="mr-2 h-4 w-4" />
                    View Details
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/browse">
            <Button
              size="lg"
              variant="outline"
              className="border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white"
            >
              <Eye className="mr-2 h-5 w-5" />
              View All Honey Batches
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
