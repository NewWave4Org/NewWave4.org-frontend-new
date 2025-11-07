import { EntityType } from '../../config';
import Link from './Link';

import { CompositeDecorator, ContentBlock, ContentState, DraftDecoratorType } from 'draft-js';

function findLinkEntities(
  /* Блок в котором производилось последнее изменение */
  contentBlock: ContentBlock,
  /* Функция, которая должна быть вызвана с индексами фрагмента текста */
  callback: (start: number, end: number) => void,
  /* Текущая карта контента */
  contentState: ContentState,
): void {
  /* Для каждого символа в блоке выполняем функцию фильтрации */
  contentBlock.findEntityRanges(character => {
    /* Получаем ключ Entity */
    const entityKey = character.getEntity();
    /* Проверяем что Entity относится к типу Entity-ссылок */
    return entityKey !== null && contentState.getEntity(entityKey).getType() === EntityType.link;
  }, callback);
}

const linkDecorator: DraftDecoratorType = new CompositeDecorator([
  {
    strategy: findLinkEntities,
    component: Link,
  },
]);

export default linkDecorator;
