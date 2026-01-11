
import { PrintType, PaperSize, PaperType } from './types';

export const PRICING = {
  [PrintType.BW]: {
    [PaperSize.CARTA]: 1.00,
    [PaperSize.OFICIO]: 1.50,
    [PaperSize.DOBLE_CARTA]: 20.00,
  },
  [PrintType.COLOR]: {
    [PaperSize.CARTA]: 5.00,
    [PaperSize.OFICIO]: 6.00,
    [PaperSize.DOBLE_CARTA]: 35.00,
  }
};

export const PAPER_ADDONS = {
  [PaperType.BOND]: 0,
  [PaperType.OPALINA]: 4,
  [PaperType.PHOTO]: 7,
  [PaperType.STICKER]: 7
};

export const WHATSAPP_LINK = "https://wa.me/message/VJ6YMTSAZLFTP1";
export const WHATSAPP_MESSAGE = "Hola, ya realicé una cotización de impresión. Les envío mis documentos para confirmar el costo final y proceder con la impresión.";
