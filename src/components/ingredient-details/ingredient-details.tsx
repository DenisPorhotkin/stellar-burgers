import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { useParams, useLocation } from 'react-router-dom';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useSelector } from '../../services/store';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const ingredients = useSelector((state) => state.ingredients.ingredients);
  const isModal = Boolean(location.state?.background);
  const ingredientData = ingredients.find(
    (ingredient) => ingredient._id === id
  );

  if (!ingredientData) {
    return <Preloader />;
  }

  return (
    <IngredientDetailsUI ingredientData={ingredientData} isModal={isModal} />
  );
};
