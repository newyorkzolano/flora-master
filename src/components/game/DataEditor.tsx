
'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { GameWrapper } from './GameWrapper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Icons } from '../icons';
import type { GameData, QuizQuestion, GameImage, LeafTreePair, QuizQuestionOption } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { FormattedText } from './FormattedText';

interface DataEditorProps {
  initialData: GameData;
  onExit: (newData: GameData) => void;
}

export function DataEditor({ initialData, onExit }: DataEditorProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [images, setImages] = useState<GameImage[]>([]);
  const [pairs, setPairs] = useState<LeafTreePair[]>([]);

  // Derived state
  const plants = images.filter(img => img.type === 'plant');
  const trees = images.filter(img => ['leaf', 'tree'].includes(img.type));
  const allTreeImages = trees.filter(t => t.type === 'tree');
  const allLeafImages = trees.filter(t => t.type === 'leaf');

  useEffect(() => {
    setQuestions(initialData.questions);
    setImages(initialData.images);
    setPairs(initialData.pairs);
  }, [initialData]);

  const handleUpdateField = <T extends { id: number }>(
    items: T[], 
    setItems: React.Dispatch<React.SetStateAction<T[]>>,
    id: number, 
    field: keyof T, 
    value: any
  ) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };
  
  const handleUpdateOptions = (id: number, optIndex: number, value: string, isForImage: boolean = false) => {
      const updateLogic = (item: QuizQuestion | GameImage) => {
          if (item.id === id) {
              const newOptions = [...(item.options || [])];
              newOptions[optIndex] = { ...newOptions[optIndex], text: value };
              return { ...item, options: newOptions };
          }
          return item;
      };

      if (isForImage) {
        setImages(images.map(updateLogic as (img: GameImage) => GameImage));
      } else {
        setQuestions(questions.map(updateLogic as (q: QuizQuestion) => QuizQuestion));
      }
  }
  
  const handleUpdateCorrectAnswer = (id: number, newCorrectIndex: number, isForImage: boolean = false) => {
    const updateLogic = (item: QuizQuestion | GameImage) => {
      if (item.id === id) {
        const newOptions = (item.options || []).map((opt, index) => ({
          ...opt,
          isCorrect: index === newCorrectIndex,
        }));
        return { ...item, options: newOptions };
      }
      return item;
    };
    if (isForImage) {
        setImages(images.map(updateLogic as (img: GameImage) => GameImage));
    } else {
        setQuestions(questions.map(updateLogic as (q: QuizQuestion) => QuizQuestion));
    }
  };
  
  const handleAddItem = <T,>(
    items: T[],
    setItems: React.Dispatch<React.SetStateAction<T[]>>,
    newItem: Omit<T, 'id'>
  ) => {
    const newId = Math.max(0, ...items.map((i: any) => i.id || 0)) + 1;
    setItems([...items, { ...newItem, id: newId } as T]);
  };

  const handleRemoveItem = <T extends { id: number }>(
    items: T[],
    setItems: React.Dispatch<React.SetStateAction<T[]>>,
    id: number,
  ) => {
    setItems(items.filter(item => item.id !== id));
  };
  
  const handleAddNewQuestion = () => {
    handleAddItem(questions, setQuestions, {
      questionText: 'Nueva Pregunta',
      options: [
        { text: 'Opción 1', isCorrect: true },
        { text: 'Opción 2', isCorrect: false },
        { text: 'Opción 3', isCorrect: false },
      ],
    });
  };

  const handleAddNewImage = (type: 'plant' | 'leaf' | 'tree') => {
    let newItem: Partial<GameImage> = {
      name: `Nuevo ${type}`,
      url: 'https://picsum.photos/seed/default/400/400',
      type: type,
    };
    if (type === 'plant') {
        newItem.options = [
            { text: 'Opción Correcta', isCorrect: true },
            { text: 'Opción Incorrecta 1', isCorrect: false },
            { text: 'Opción Incorrecta 2', isCorrect: false },
        ];
    }
    handleAddItem(images, setImages, newItem);
  };
  
  const handleAddNewPair = () => {
      if (allLeafImages.length > 0 && allTreeImages.length > 0) {
        handleAddItem(pairs, setPairs, {
          leafId: allLeafImages[0].id,
          treeId: allTreeImages[0].id,
        });
      } else {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Debes tener al menos una hoja y un árbol para crear un par."
        });
      }
  };

  const handleSaveData = () => {
    const dataToSave: GameData = { questions, images, pairs };
    const jsonString = JSON.stringify(dataToSave, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'floramaster-data.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast({
        title: "Datos Guardados",
        description: "Tus datos se han descargado como 'floramaster-data.json'."
    });
  };

  const handleRestoreDataClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const restoredData = JSON.parse(text) as GameData;
        
        if (restoredData.questions && restoredData.images && restoredData.pairs) {
            setQuestions(restoredData.questions);
            setImages(restoredData.images);
            setPairs(restoredData.pairs);
            toast({
                title: "Datos Restaurados",
                description: "Tus datos se han cargado correctamente desde el archivo."
            });
        } else {
            throw new Error("El formato del archivo no es válido.");
        }
      } catch (error) {
        toast({
            variant: "destructive",
            title: "Error al Restaurar",
            description: "El archivo no es un JSON válido o no tiene el formato correcto."
        });
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const handleExit = () => {
    onExit({ questions, images, pairs });
  };
  
  return (
    <GameWrapper title="Modo Edición" description="Añade, edita, guarda o restaura los datos del juego.">
        <Tabs defaultValue="questions" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="questions">Preguntas</TabsTrigger>
            <TabsTrigger value="plants">Plantas</TabsTrigger>
            <TabsTrigger value="trees">Árboles/Hojas</TabsTrigger>
            <TabsTrigger value="pairs">Pares</TabsTrigger>
          </TabsList>
          
          <TabsContent value="questions">
            <Card>
              <CardHeader>
                <CardTitle>Editor de Preguntas</CardTitle>
                <Button onClick={handleAddNewQuestion}><Icons.Plus className="mr-2" /> Añadir Pregunta</Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {questions.map((q) => (
                  <Card key={q.id} className="p-4 space-y-2">
                    <Label htmlFor={`q-text-${q.id}`}>Texto de la Pregunta</Label>
                    <Textarea id={`q-text-${q.id}`} value={q.questionText} onChange={(e) => handleUpdateField(questions, setQuestions, q.id, 'questionText', e.target.value)} />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      {(q.options || []).map((opt, optIndex) => (
                        <div key={optIndex}>
                          <Label htmlFor={`q-${q.id}-opt-${optIndex}`}>Opción {optIndex + 1}</Label>
                          <Input id={`q-${q.id}-opt-${optIndex}`} value={opt.text} onChange={(e) => handleUpdateOptions(q.id, optIndex, e.target.value)} />
                        </div>
                      ))}
                    </div>
                    <Label htmlFor={`q-correct-${q.id}`}>Respuesta Correcta</Label>
                    <Select value={(q.options || []).findIndex(o => o.isCorrect).toString()} onValueChange={(val) => handleUpdateCorrectAnswer(q.id, parseInt(val))}>
                      <SelectTrigger><SelectValue/></SelectTrigger>
                      <SelectContent>
                        {(q.options || []).map((_opt, optIndex) => <SelectItem key={optIndex} value={optIndex.toString()}>{`Opción ${optIndex + 1}`}</SelectItem>)}
                      </SelectContent>
                    </Select>
                     <Button variant="ghost" size="sm" onClick={() => handleRemoveItem(questions, setQuestions, q.id)}><Icons.X className="mr-2 text-destructive" /> Eliminar Pregunta</Button>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="plants">
             <Card>
              <CardHeader>
                  <CardTitle>Editor de Plantas</CardTitle>
                  <Button onClick={() => handleAddNewImage('plant')}><Icons.Plus className="mr-2" /> Añadir Planta</Button>
              </CardHeader>
              <CardContent className="space-y-4">
                  {plants.map((plant) => (
                      <Card key={plant.id} className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                        <div className="space-y-2 col-span-1 md:col-span-2">
                            <Label htmlFor={`plant-name-${plant.id}`}>Nombre de la Planta (Respuesta Correcta)</Label>
                            <Input id={`plant-name-${plant.id}`} value={plant.name} onChange={(e) => handleUpdateField(images, setImages, plant.id, 'name', e.target.value)} />
                            <Label htmlFor={`plant-url-${plant.id}`}>URL de la Imagen</Label>
                            <Input id={`plant-url-${plant.id}`} value={plant.url} onChange={(e) => handleUpdateField(images, setImages, plant.id, 'url', e.target.value)} />

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-4">
                                {(plant.options || []).map((opt, optIndex) => (
                                    <div key={optIndex}>
                                    <Label htmlFor={`plant-${plant.id}-opt-${optIndex}`}>Opción de Texto {optIndex + 1}</Label>
                                    <Input id={`plant-${plant.id}-opt-${optIndex}`} value={opt.text} onChange={(e) => handleUpdateOptions(plant.id, optIndex, e.target.value, true)} />
                                    </div>
                                ))}
                            </div>
                            <Label htmlFor={`plant-correct-${plant.id}`}>Opción Correcta</Label>
                            <Select value={(plant.options || []).findIndex(o => o.isCorrect).toString()} onValueChange={(val) => handleUpdateCorrectAnswer(plant.id, parseInt(val), true)}>
                                <SelectTrigger><SelectValue/></SelectTrigger>
                                <SelectContent>
                                    {(plant.options || []).map((_opt, optIndex) => <SelectItem key={optIndex} value={optIndex.toString()}>{`Opción ${optIndex + 1}`}</SelectItem>)}
                                </SelectContent>
                            </Select>

                             <div className="col-span-1 md:col-span-3 flex justify-end mt-4">
                                <Button variant="ghost" size="sm" onClick={() => handleRemoveItem(images, setImages, plant.id)}><Icons.X className="mr-2 text-destructive" /> Eliminar Planta</Button>
                            </div>
                        </div>
                        <div className="relative aspect-square w-full h-full rounded-lg overflow-hidden border">
                           {plant.url ? <Image src={plant.url} alt={plant.name} fill className="object-cover" /> : <div className="bg-muted h-full flex items-center justify-center"><Icons.Image className="text-muted-foreground" /></div>}
                        </div>
                      </Card>
                  ))}
              </CardContent>
             </Card>
          </TabsContent>
          
          <TabsContent value="trees">
            <Card>
                <CardHeader className="flex-row items-center justify-between">
                    <CardTitle>Editor de Árboles y Hojas</CardTitle>
                    <div className="flex gap-2">
                        <Button onClick={() => handleAddNewImage('leaf')}><Icons.Leaf className="mr-2" /> Añadir Hoja</Button>
                        <Button onClick={() => handleAddNewImage('tree')}><Icons.Tree className="mr-2" /> Añadir Árbol</Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {trees.map((tree) => (
                        <Card key={tree.id} className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                            <div className="space-y-2 col-span-1 md:col-span-3">
                                <Label htmlFor={`tree-name-${tree.id}`}>Nombre</Label>
                                <Input id={`tree-name-${tree.id}`} value={tree.name} onChange={(e) => handleUpdateField(images, setImages, tree.id, 'name', e.target.value)} />
                                <Label htmlFor={`tree-url-${tree.id}`}>URL de la Imagen</Label>
                                <Input id={`tree-url-${tree.id}`} value={tree.url} onChange={(e) => handleUpdateField(images, setImages, tree.id, 'url', e.target.value)} />
                                <Label>Tipo: {tree.type === 'leaf' ? 'Hoja' : 'Árbol'}</Label>
                            </div>
                             <div className="relative aspect-square w-full h-full rounded-lg overflow-hidden border">
                                {tree.url ? <Image src={tree.url} alt={tree.name} fill className="object-cover" /> : <div className="bg-muted h-full flex items-center justify-center"><Icons.Image className="text-muted-foreground" /></div>}
                            </div>
                            <div className="col-span-1 md:col-span-4 flex justify-end">
                                <Button variant="ghost" size="sm" onClick={() => handleRemoveItem(images, setImages, tree.id)}><Icons.X className="mr-2 text-destructive" /> Eliminar</Button>
                            </div>
                        </Card>
                    ))}
                </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pairs">
            <Card>
                <CardHeader>
                    <CardTitle>Editor de Pares Hoja-Árbol</CardTitle>
                    <Button onClick={handleAddNewPair}><Icons.Plus className="mr-2" /> Añadir Par</Button>
                </CardHeader>
                <CardContent className="space-y-4">
                    {pairs.map((pair, index) => {
                        const leafName = images.find(i => i.id === pair.leafId)?.name || 'N/A';
                        const treeName = images.find(i => i.id === pair.treeId)?.name || 'N/A';
                        return (
                        <Card key={index} className="p-4 space-y-2">
                           <div className="grid grid-cols-2 gap-4 items-center">
                               <div>
                                   <Label>Hoja</Label>
                                   <FormattedText text={leafName} className="font-bold" />
                               </div>
                               <div>
                                   <Label>Árbol</Label>
                                    <FormattedText text={treeName} className="font-bold" />
                               </div>
                           </div>
                           <div className="flex justify-end">
                                <Button variant="ghost" size="sm" onClick={() => setPairs(pairs.filter((_, i) => i !== index))}>
                                    <Icons.X className="mr-2 text-destructive" /> Eliminar Par
                                </Button>
                           </div>
                        </Card>
                    )})}
                </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6 pt-6 border-t flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex gap-2">
              <Button onClick={handleSaveData} variant="outline">
                <Icons.FileJson className="mr-2" /> Guardar Datos
              </Button>
              <Button onClick={handleRestoreDataClick} variant="outline">
                <Icons.Upload className="mr-2" /> Restaurar Datos
              </Button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange}
                accept=".json"
                className="hidden"
              />
            </div>
            <Button onClick={handleExit}>
                Salir del Modo Edición
            </Button>
        </div>
    </GameWrapper>
  );
}
