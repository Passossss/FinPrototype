import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Calendar, DollarSign, ArrowUp, ArrowDown } from "lucide-react";
import { toast } from "sonner@2.0.3";

export function TransactionRegistration() {
  const [formData, setFormData] = useState({
    type: "",
    amount: "",
    category: "",
    description: "",
    date: new Date().toISOString().split('T')[0]
  });

  const [transactions, setTransactions] = useState([
    {
      id: 1,
      type: "Despesa",
      amount: -45.90,
      category: "Alimentação",
      description: "Almoço no restaurante",
      date: "2024-03-15",
      color: "#ef4444"
    },
    {
      id: 2,
      type: "Receita",
      amount: 1200.00,
      category: "Salário",
      description: "Salário mensal",
      date: "2024-03-01",
      color: "#10b981"
    },
    {
      id: 3,
      type: "Despesa",
      amount: -25.00,
      category: "Transporte",
      description: "Uber para faculdade",
      date: "2024-03-14",
      color: "#3b82f6"
    }
  ]);

  const categories = [
    { name: "Alimentação", type: "Despesa", color: "#ef4444" },
    { name: "Transporte", type: "Despesa", color: "#3b82f6" },
    { name: "Salário", type: "Receita", color: "#10b981" },
    { name: "Entretenimento", type: "Despesa", color: "#8b5cf6" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedCategory = categories.find(cat => cat.name === formData.category);
    const amount = parseFloat(formData.amount);
    const finalAmount = formData.type === "Despesa" ? -Math.abs(amount) : Math.abs(amount);
    
    const newTransaction = {
      id: Date.now(),
      type: formData.type,
      amount: finalAmount,
      category: formData.category,
      description: formData.description,
      date: formData.date,
      color: selectedCategory?.color || "#f87b07"
    };
    
    setTransactions(prev => [newTransaction, ...prev]);
    toast.success("Transação registrada com sucesso!");
    setFormData({
      type: "",
      amount: "",
      category: "",
      description: "",
      date: new Date().toISOString().split('T')[0]
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const filteredCategories = categories.filter(cat => 
    !formData.type || cat.type === formData.type
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(Math.abs(amount));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Registro de Transações</h2>
        <p className="text-gray-600 mt-1">Acompanhe suas receitas e despesas</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Nova Transação</CardTitle>
            <CardDescription>
              Registre uma nova receita ou despesa
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Tipo de Transação</Label>
                <Select onValueChange={(value) => handleChange("type", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Receita">
                      <div className="flex items-center gap-2">
                        <ArrowUp className="h-4 w-4 text-green-600" />
                        Receita
                      </div>
                    </SelectItem>
                    <SelectItem value="Despesa">
                      <div className="flex items-center gap-2">
                        <ArrowDown className="h-4 w-4 text-red-600" />
                        Despesa
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Valor</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.amount}
                    onChange={(e) => handleChange("amount", e.target.value)}
                    placeholder="0,00"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Categoria</Label>
                <Select 
                  onValueChange={(value) => handleChange("category", value)}
                  disabled={!formData.type}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredCategories.map((category) => (
                      <SelectItem key={category.name} value={category.name}>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: category.color }}
                          />
                          {category.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Data</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleChange("date", e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Descreva a transação (opcional)"
                  rows={3}
                />
              </div>

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                Registrar Transação
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Transações Recentes</CardTitle>
            <CardDescription>
              Últimas transações registradas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: transaction.color + "20" }}
                    >
                      {transaction.type === "Receita" ? (
                        <ArrowUp className="h-5 w-5" style={{ color: transaction.color }} />
                      ) : (
                        <ArrowDown className="h-5 w-5" style={{ color: transaction.color }} />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Badge variant="outline" className="text-xs">
                          {transaction.category}
                        </Badge>
                        <span>{formatDate(transaction.date)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-semibold ${
                        transaction.amount > 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {transaction.amount > 0 ? "+" : ""}{formatCurrency(transaction.amount)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}