import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from '@showcase/components/ui/menubar';
import { Text } from '@showcase/components/ui/text';
import * as React from 'react';

export function MenubarPreview() {
  const [showBookmarks, setShowBookmarks] = React.useState(true);
  const [showUrls, setShowUrls] = React.useState(false);
  const [person, setPerson] = React.useState('pedro');
  const [value, setValue] = React.useState<string>();

  return (
    <Menubar value={value} onValueChange={setValue}>
      <MenubarMenu value="file">
        <MenubarTrigger>
          <Text>File</Text>
        </MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            <Text>New Tab</Text>
            <MenubarShortcut>⌘T</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            <Text>New Window</Text>
            <MenubarShortcut>⌘N</MenubarShortcut>
          </MenubarItem>
          <MenubarItem disabled>
            <Text>New Incognito Window</Text>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>
              <Text>Share</Text>
            </MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>
                <Text>Email link</Text>
              </MenubarItem>
              <MenubarItem>
                <Text>Messages</Text>
              </MenubarItem>
              <MenubarItem>
                <Text>Notes</Text>
              </MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem>
            <Text>Print...</Text>
            <MenubarShortcut>⌘P</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu value="edit">
        <MenubarTrigger>
          <Text>Edit</Text>
        </MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            <Text>Undo</Text>
            <MenubarShortcut>⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            <Text>Redo</Text>
            <MenubarShortcut>⇧⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>
              <Text>Find</Text>
            </MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>
                <Text>Search the web</Text>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem>
                <Text>Find...</Text>
              </MenubarItem>
              <MenubarItem>
                <Text>Find Next</Text>
              </MenubarItem>
              <MenubarItem>
                <Text>Find Previous</Text>
              </MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem>
            <Text>Cut</Text>
          </MenubarItem>
          <MenubarItem>
            <Text>Copy</Text>
          </MenubarItem>
          <MenubarItem>
            <Text>Paste</Text>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu value="view">
        <MenubarTrigger>
          <Text>View</Text>
        </MenubarTrigger>
        <MenubarContent>
          <MenubarCheckboxItem checked={showBookmarks} onCheckedChange={setShowBookmarks}>
            <Text>Always Show Bookmarks Bar</Text>
          </MenubarCheckboxItem>
          <MenubarCheckboxItem checked={showUrls} onCheckedChange={setShowUrls}>
            <Text>Always Show Full URLs</Text>
          </MenubarCheckboxItem>
          <MenubarSeparator />
          <MenubarItem inset>
            <Text>Reload</Text>
            <MenubarShortcut>⌘R</MenubarShortcut>
          </MenubarItem>
          <MenubarItem disabled inset>
            <Text>Force Reload</Text>
            <MenubarShortcut>⇧⌘R</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem inset>
            <Text>Toggle Fullscreen</Text>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem inset>
            <Text>Hide Sidebar</Text>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu value="profiles">
        <MenubarTrigger>
          <Text>Profiles</Text>
        </MenubarTrigger>
        <MenubarContent>
          <MenubarRadioGroup value={person} onValueChange={setPerson}>
            <MenubarRadioItem value="andy">
              <Text>Andy</Text>
            </MenubarRadioItem>
            <MenubarRadioItem value="benoit">
              <Text>Benoit</Text>
            </MenubarRadioItem>
            <MenubarRadioItem value="luis">
              <Text>Luis</Text>
            </MenubarRadioItem>
          </MenubarRadioGroup>
          <MenubarSeparator />
          <MenubarItem inset>
            <Text>Edit...</Text>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem inset>
            <Text>Add Profile...</Text>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
