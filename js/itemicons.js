/* Ícone de cada coisa do Pessoal pelo que a pessoa escreveu ("levar no hospital" → hospital). Tudo no aparelho, sem rede.
   O dicionário tem 99 assuntos; null = vale o ícone da categoria. */
import DIC from './icones-dicionario.js';
import { criarItemLook } from './classificar.js';
export const itemLook = criarItemLook(DIC); // { ic, g: [cor, cor], emoji, cat, fantasia } | null
/* a fantasia do dicionário → a roupa que o mascote já tem (por cima do boneco oficial) */
const ROUPA = { medico: 'saude', motorista: 'viagem', barbeiro: 'beleza', dentista: 'saude', chef: 'comida', professor: 'estudo', mecanico: 'obra', personal: 'treino', jardineiro: 'calma', viajante: 'viagem', estudante: 'estudo', 'pai-mae-carrinho': 'amigos' };
export const roupaDe = (it) => ROUPA[itemLook(it.title || '', it.note || '')?.fantasia] || '';
