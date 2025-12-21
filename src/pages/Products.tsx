import { useState } from "react";
import { Plus, Filter, Package as PackageIcon, Edit } from "lucide-react";
import { OutlookLayout } from "@/components/layout/OutlookLayout";
import { ListPane } from "@/components/layout/ListPane";
import { DetailPane } from "@/components/layout/DetailPane";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  description: string;
  price: number;
  stock: number;
  minStock: number;
  unit: string;
  status: "in-stock" | "low-stock" | "out-of-stock";
}

const mockProducts: Product[] = [
  {
    id: "1",
    name: "Disposable Syringes (10ml)",
    sku: "MED-SYR-010",
    category: "Medical Supplies",
    description: "Sterile disposable syringes for medical use. Pack of 100 units.",
    price: 25.99,
    stock: 450,
    minStock: 100,
    unit: "Pack",
    status: "in-stock",
  },
  {
    id: "2",
    name: "Surgical Gloves (M)",
    sku: "MED-GLV-M",
    category: "Protective Equipment",
    description: "Latex-free surgical gloves, medium size. Box of 100 pairs.",
    price: 18.50,
    stock: 85,
    minStock: 100,
    unit: "Box",
    status: "low-stock",
  },
  {
    id: "3",
    name: "Blood Pressure Monitor",
    sku: "EQP-BPM-001",
    category: "Equipment",
    description: "Digital blood pressure monitor with LCD display and memory function.",
    price: 89.99,
    stock: 25,
    minStock: 10,
    unit: "Unit",
    status: "in-stock",
  },
  {
    id: "4",
    name: "Antiseptic Solution (500ml)",
    sku: "MED-ANT-500",
    category: "Medications",
    description: "Chlorhexidine-based antiseptic solution for wound cleaning.",
    price: 12.75,
    stock: 0,
    minStock: 50,
    unit: "Bottle",
    status: "out-of-stock",
  },
  {
    id: "5",
    name: "Bandage Rolls (5cm)",
    sku: "MED-BND-5CM",
    category: "Medical Supplies",
    description: "Elastic bandage rolls for wound dressing. Pack of 12 rolls.",
    price: 15.99,
    stock: 200,
    minStock: 75,
    unit: "Pack",
    status: "in-stock",
  },
];

export default function Products() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = mockProducts.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: Product["status"]) => {
    switch (status) {
      case "in-stock":
        return "status-success";
      case "low-stock":
        return "status-warning";
      case "out-of-stock":
        return "status-error";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <OutlookLayout
      listPane={
        <ListPane
          title="Products"
          searchPlaceholder="Search products..."
          onSearch={setSearchQuery}
          actions={
            <div className="flex gap-2">
              <Button variant="ghost" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
              <Button size="sm" className="gap-1">
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </div>
          }
        >
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => setSelectedProduct(product)}
              className={cn(
                "list-item",
                selectedProduct?.id === product.id && "active"
              )}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <PackageIcon className="h-5 w-5 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm truncate">
                      {product.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{product.sku}</span>
                    <span className={cn("status-badge text-xs", getStatusColor(product.status))}>
                      {product.stock} in stock
                    </span>
                  </div>
                </div>
                <span className="font-semibold text-sm">{formatCurrency(product.price)}</span>
              </div>
            </div>
          ))}
        </ListPane>
      }
      detailPane={
        <DetailPane
          title={selectedProduct?.name}
          subtitle={selectedProduct?.sku}
          onClose={() => setSelectedProduct(null)}
          emptyState={
            <div className="text-center">
              <p className="text-lg font-medium">Select a product</p>
              <p className="text-sm">Choose a product from the list to view details</p>
            </div>
          }
          actions={
            selectedProduct && (
              <Button size="sm" className="gap-1">
                <Edit className="h-4 w-4" />
                Edit
              </Button>
            )
          }
        >
          {selectedProduct && (
            <div className="space-y-6">
              {/* Product Info */}
              <div className="grid gap-4 md:grid-cols-2">
                <InfoCard label="Category" value={selectedProduct.category} />
                <InfoCard label="Unit" value={selectedProduct.unit} />
                <InfoCard label="Price" value={formatCurrency(selectedProduct.price)} />
                <InfoCard label="Stock Level" value={`${selectedProduct.stock} units`} />
                <InfoCard label="Minimum Stock" value={`${selectedProduct.minStock} units`} />
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">Status</p>
                  <Badge className={cn(getStatusColor(selectedProduct.status))}>
                    {selectedProduct.status.replace("-", " ")}
                  </Badge>
                </div>
              </div>

              {/* Description */}
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground mb-2">Description</p>
                <p className="text-sm">{selectedProduct.description}</p>
              </div>

              {/* Stock Alert */}
              {selectedProduct.stock <= selectedProduct.minStock && (
                <div className={cn(
                  "p-4 rounded-lg border",
                  selectedProduct.stock === 0 
                    ? "bg-destructive/10 border-destructive/20"
                    : "bg-warning/10 border-warning/20"
                )}>
                  <p className={cn(
                    "text-sm font-medium",
                    selectedProduct.stock === 0 ? "text-destructive" : "text-warning"
                  )}>
                    {selectedProduct.stock === 0
                      ? "Out of Stock - Reorder Required"
                      : "Low Stock Alert - Consider Reordering"}
                  </p>
                </div>
              )}

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
                <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                  Add to Order
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                  Adjust Stock
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                  View History
                </Badge>
              </div>
            </div>
          )}
        </DetailPane>
      }
    />
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 rounded-lg bg-muted/50">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}
