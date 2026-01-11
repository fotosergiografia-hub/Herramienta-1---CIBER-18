
export enum PrintType {
  BW = 'Blanco y negro',
  COLOR = 'Color'
}

export enum PaperType {
  BOND = 'Papel bond (clásico)',
  OPALINA = 'Opalina (tipo cartulina)',
  PHOTO = 'Papel fotográfico (brillante)',
  STICKER = 'Sticker o pegatina'
}

export enum PaperSize {
  CARTA = 'Carta',
  OFICIO = 'Oficio',
  DOBLE_CARTA = 'Doble carta'
}

export interface QuoteState {
  printType: PrintType | null;
  paperType: PaperType | null;
  paperSize: PaperSize | null;
  quantity: number;
}
