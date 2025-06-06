import { BooleanLike } from 'common/react';
import {
  BlockQuote,
  Box,
  Button,
  Collapsible,
  Section,
} from 'tgui-core/components';

import { useBackend } from '../backend';
import { Window } from '../layouts';

interface AIRackData {
  powered: BooleanLike;
  lawTitles: string[];
  lawText: string[];
  welded: BooleanLike[];
  screwed: BooleanLike[];
}

export const AIRack = () => {
  const { act, data } = useBackend<AIRackData>();
  const { powered, lawTitles, lawText, welded, screwed } = data;
  return (
    <Window title="AI Law Rack" width={600} height={800}>
      <Window.Content scrollable>
        <Section>
          <Box>
            {lawTitles.map((item, index) => (
              <Collapsible
                key={index}
                title={item ? lawTitles[index] : 'Empty'}
                open={item ? true : false}
              >
                <BlockQuote preserveWhitespace>
                  {item ? lawText[index] : '<Empty Slot>'}
                </BlockQuote>
                <Button
                  icon={item ? 'circle' : 'circle-o'}
                  onClick={() => act('rack', { rack_index: index + 1 })}
                  disabled={
                    (!powered && item ? true : false) ||
                    welded[index] ||
                    screwed[index]
                  }
                  tooltip={moduleTooltip(
                    item ? true : false,
                    powered,
                    welded[index],
                    screwed[index],
                  )}
                >
                  {item ? 'Remove' : 'Empty'}
                </Button>
                <Button
                  icon={welded[index] ? 'circle' : 'circle-o'}
                  onClick={() => act('weld', { rack_index: index + 1 })}
                  color={welded[index] ? 'red' : 'green'}
                >
                  {welded[index] ? 'Welded' : 'Not Welded'}
                </Button>
                <Button
                  icon={screwed[index] ? 'circle' : 'circle-o'}
                  onClick={() => act('screw', { rack_index: index + 1 })}
                  color={screwed[index] ? 'red' : 'green'}
                >
                  {screwed[index] ? 'Screwed In' : 'Not Screwed In'}
                </Button>
              </Collapsible>
            ))}
          </Box>
        </Section>
      </Window.Content>
    </Window>
  );
};

const moduleTooltip = (
  filled: BooleanLike,
  powered: BooleanLike,
  welded: BooleanLike,
  screwed: BooleanLike,
) => {
  if (!filled) {
    return 'Insert a module';
  }
  if (!powered) {
    return 'The AI Law Rack is unpowered';
  }
  if (welded && screwed) {
    return 'The module is welded and screwed in place';
  }
  if (welded) {
    return `The module is welded in place`;
  }
  if (screwed) {
    return 'The module is screwed in place';
  }
  return 'Remove the module';
};
