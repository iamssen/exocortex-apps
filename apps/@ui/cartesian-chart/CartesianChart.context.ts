import type { Context } from 'react';
import { createContext, useContext } from 'react';

export interface CartesianChartStates {
  width: number;
  height: number;
}

export const CartesianChartContext: Context<CartesianChartStates> =
  createContext<CartesianChartStates>(null!);

export function useCartesianChart(): CartesianChartStates {
  return useContext(CartesianChartContext);
}
