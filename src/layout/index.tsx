import { useDisclosure } from '@mantine/hooks';
import { rem, Burger, AppShell } from '@mantine/core';

function Layout() {
  const [opened, { toggle }] = useDisclosure();
  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 200, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="sm"
    >
      <AppShell.Header zIndex={201}>
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
        <div>Logo</div>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        2
      </AppShell.Navbar>
      {/* <MacScrollbar className="h-full overflow-y-auto" skin={isDark ? 'dark' : 'light'}> */}
      <AppShell.Main pt={`calc(${rem(60)} + var(--mantine-spacing-md))`}>
        <div className="h-[2000px] bg-red">2</div>
      </AppShell.Main>
      {/* </MacScrollbar> */}

    </AppShell>
  // <div className="h-screen flex">
  //   <div className="h-full w-20 bg-red"></div>
  //   <div className="h-full w-full overflow-hidden">
  //     <div className="h-20 w-full bg-blue">

  //     </div>
  //     <MacScrollbar className="h-full overflow-y-auto" skin={isDark ? 'dark' : 'light'}>
  //       <Outlet />
  //     </MacScrollbar>

  //   </div>
  // </div>
  );
}

export default Layout;
