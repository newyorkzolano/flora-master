import type { GameData } from './types';
import placeholderData from './placeholder-images.json';

// The localGameData constant now correctly loads images from the JSON file.
export const localGameData: GameData = {
  questions: [
    {
      "id": 1,
      "questionText": "El algarrobo (_Ceratonia siliqua_) se cultivaba históricamente en Murcia. ¿Para qué se empleaban principalmente estas semillas?",
      "options": [
        { "text": "Para adornar jardines y patios históricos", "isCorrect": false },
        { "text": "Como unidad de medida estándar para pesar oro, especias u otros productos comerciales ", "isCorrect": true },
        { "text": "Para fabricar cuerdas, collares y utensilios domésticos", "isCorrect": false }
      ]
    },
    {
      "id": 2,
      "questionText": "Algunas especies endémicas del sureste ibérico, como _Teucrium freynii_ y _Limonium thiniense_, presentan distribuciones muy fragmentadas en sierras litorales murcianas y zonas afines del norte de África. Estos taxones muestran divergencia genética pese a su parecido morfológico.\n¿Cuál de las siguientes hipótesis biogeográficas explica mejor este patrón de distribución?",
      "options": [
        { "text": "Vicariancia asociada a la fragmentación de antiguos hábitats litorales durante oscilaciones climáticas del Cuaternario, que aisló poblaciones originalmente continuas", "isCorrect": true },
        { "text": "Dispersión a larga distancia mediante corrientes marinas desde el norte de África hacia la costa murciana", "isCorrect": false },
        { "text": "Radiación adaptativa reciente originada en un único foco murciano, con posterior expansión hacia África", "isCorrect": false }
      ]
    },
    {
      "id": 3,
      "questionText": "En el valle del Guadalentín se han hallado restos arqueológicos de _Stipa tenacissima_ (esparto) y _Chamaerops humilis_ (palmito).\n¿Desde cuándo se documenta el uso sistemático del esparto y el palmito en Murcia?",
      "options": [
        { "text": "Hace unos 3.000–3.500 años (Edad del Bronce).", "isCorrect": true },
        { "text": "Hace unos 2.000 años (época romana).", "isCorrect": false },
        { "text": "Hace unos 1.000 años (Edad Media, periodo andalusí).", "isCorrect": false }
      ]
    }
  ],
  images: placeholderData.placeholderImages,
  pairs: placeholderData.pairs,
};
