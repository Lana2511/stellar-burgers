import { FC, useMemo } from 'react';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { clearConstructor } from '../../services/slices/ConstructorSlice';
import { clearOrder, sendOrder } from '../../services/slices/OrderSlice';

type TConstructorItems = {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
};

export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const constructorItems = useSelector((state) => state.burgerConstructor);

  const dispatch = useDispatch();

  // Собираем массив id ингредиентов для заказа
  const ingredientIds = [
    ...(constructorItems.bun ? [constructorItems.bun._id] : []),
    ...constructorItems.ingredients.map((item) => item._id),
    ...(constructorItems.bun ? [constructorItems.bun._id] : [])
  ];

  const { orderRequest, orderModalData } = useSelector((state) => state.order);

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    dispatch(sendOrder(ingredientIds));
  };
  const closeOrderModal = () => {
    dispatch(clearConstructor());
    dispatch(clearOrder());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
