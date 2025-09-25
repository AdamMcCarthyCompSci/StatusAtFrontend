import {useContext, useEffect, useMemo, useState} from "react";
import {useDisclosure, useMediaQuery} from "@mantine/hooks";
import {
  ActionIcon,
  AppShell,
  Burger,
  Button,
  Group,
  Image,
  Menu,
  NavLink,
  rem,
  Tooltip,
  useMantineColorScheme,
} from "@mantine/core";
import {Link as RouterLink, Link, Route, Routes, useLocation, useNavigate,} from "react-router-dom";
import {IconHome, IconLogout, IconMoon, IconRosette, IconSun, IconUser,} from "@tabler/icons-react";

import mySvg from "../Images/crochetLogo.svg";
import NotFound from "./NotFound";
import HomeShell from "./Home/HomeShell";
import SignIn from "./Authentication/SignIn";
import SignUp from "./Authentication/SignUp";
import ForgotPassword from "./Authentication/ForgotPassword";
import {makeAuthenticatedRequest} from "../Utils/authenticated_request";
import {UserContext} from "../Context/User.tsx";
import PremiumShell from "./Premium/PremiumShell";
import ConfirmEmail from "./Authentication/ConfirmEmail";
import EmailConfirmation from "./Authentication/EmailConfirmation";
import Privacy from "./Privacy";
import Terms from "./Terms";
import Unsubscribe from "@/components/Misc/unsubscribe.tsx";

const Shell = () => {
  const [navBarOpened, { toggle: navBarToggle }] = useDisclosure();
  const [asideOpened] = useDisclosure();
  const [active, setActive] = useState(-1);
  const location = useLocation();
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const { user, updateUser } = useContext(UserContext);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const navigate = useNavigate();

  const data = useMemo(() => {
    return [
      {
        icon: IconHome,
        label: "Home",
        description: "Home page",
        href: "",
      },
    ];
  }, [user?.is_admin]);

  const buildRoutes = (routes) => {
    return routes.map((route, index) => (
      <Route key={index} path={route.path} element={route.element}>
        {route.children && buildRoutes(route.children)}
      </Route>
    ));
  };
  const routes = [
    { path: "", element: <HomeShell />, children: [] },
    { path: "sign-in", element: <SignIn />, children: [] },
    { path: "sign-up", element: <SignUp />, children: [] },
    { path: "forgot-password", element: <ForgotPassword />, children: [] },
    { path: "confirm-email", element: <ConfirmEmail />, children: [] },
    {
      path: "email-confirmation/:token",
      element: <EmailConfirmation />,
      children: [],
    },
    { path: "premium", element: <PremiumShell />, children: [] },
    { path: "privacy", element: <Privacy />, children: [] },
    { path: "terms", element: <Terms />, children: [] },
    { path: "unsubscribe/:token", element: <Unsubscribe />, children: [] },
    { path: "*", element: <NotFound />, children: [] },
  ];
  const routeElements = buildRoutes(routes);

  const updateUserColorScheme = async (colorScheme) => {
    try {
      const body = JSON.stringify({ color_scheme: colorScheme });
      const response = await makeAuthenticatedRequest(
        `${import.meta.env.VITE_API_HOST}/user/${user.id}/`,
        { method: "PATCH", body }
      );

      if (response.ok) {
        await response.json();
      } else {
        console.error("Request failed with status:", response.status);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleLogout = () => {
    updateUser(null);
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    navigate("");
  };

  const handleColorScheme = (user) => {
    const updatedColorScheme = colorScheme === "light" ? "dark" : "light";
    setColorScheme(updatedColorScheme);
    if (user) {
      updateUserColorScheme(updatedColorScheme);
    }
  };

  useEffect(() => {
    // Extract the pattern type from the current location
    const patternType = location.pathname.split("/")[1];

    // Find the index of the pattern type in the data array
    const index = data.findIndex((item) => item.href === patternType);

    // Update the active index if found
    if (index !== -1) {
      setActive(index);
    }

    if (navBarOpened) {
      navBarToggle();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <AppShell
      header={{
        height: "10vh",
        maxHeight: "10vh",
      }}
      navbar={{
        breakpoint: 1000000000,
        collapsed: { mobile: !navBarOpened },
      }}
      aside={{
        width: "20%",
        collapsed: { mobile: asideOpened },
      }}
      // padding="md"
    >
      <AppShell.Header>
        <Group p={"5px"} justify={"space-between"}>
          <Tooltip label="Menu">
            <Burger opened={navBarOpened} onClick={navBarToggle} size="xl" />
          </Tooltip>
          {!isMobile && (
            <Tooltip label="Home">
              <Image
                onClick={() => {
                  navigate("/");
                }}
                src={mySvg}
                style={{
                  height: "8vh",
                }}
              ></Image>
            </Tooltip>
          )}
          <Group p={"5px"}>
            {user && (
              <Button
                leftSection={<IconRosette size={14} />}
                component={RouterLink}
                to="/premium"
              >
                Premium
              </Button>
            )}
            {user ? (
              <Menu width={200} withArrow shadow="md">
                <Menu.Target>
                  <Tooltip label="User">
                    <ActionIcon variant="outline" title="User">
                      <IconUser style={{ width: 18, height: 18 }} />
                    </ActionIcon>
                  </Tooltip>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Label>Profile: {user.name}</Menu.Label>
                  <Menu.Item
                    onClick={() => handleColorScheme(true)}
                    leftSection={
                      colorScheme === "light" ? (
                        <IconSun style={{ width: rem(14), height: rem(14) }} />
                      ) : (
                        <IconMoon style={{ width: rem(14), height: rem(14) }} />
                      )
                    }
                  >
                    Default color scheme
                  </Menu.Item>
                  <Menu.Item
                    onClick={() => handleLogout()}
                    leftSection={
                      <IconLogout style={{ width: rem(14), height: rem(14) }} />
                    }
                  >
                    Logout
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            ) : (
              <Tooltip label="Toggle Color Scheme">
                <ActionIcon
                  variant="outline"
                  onClick={() => handleColorScheme(false)}
                  title="Toggle color scheme"
                >
                  {colorScheme === "light" ? (
                    <IconSun style={{ width: 18, height: 18 }} />
                  ) : (
                    <IconMoon style={{ width: 18, height: 18 }} />
                  )}
                </ActionIcon>
              </Tooltip>
            )}
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar>
        {data.map((item, index) => (
          <Link
            to={item.href}
            key={item.label}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <NavLink
              component="button"
              active={index === active}
              label={item.label}
              description={item.description}
              leftSection={<item.icon size="1rem" stroke={1.5} />}
              onClick={() => setActive(index)}
              color="violet"
            />
          </Link>
        ))}
      </AppShell.Navbar>

      <Routes>{routeElements}</Routes>
    </AppShell>
  );
};

export default Shell;
