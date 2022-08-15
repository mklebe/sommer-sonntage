import { AppBar, Divider, IconButton, Menu, MenuItem, Toolbar, Typography } from '@mui/material'
import { ReactElement, useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';

import Link from 'next/link';

export function Navigation(): ReactElement {
    const [menuAnchor, setMenuAnchor] = useState<null|HTMLElement>(null);
    const isMenuOpen = Boolean(menuAnchor);
  
    function closeMenu():void {
      setMenuAnchor(null)
    }
  
    function openMenu(event: React.MouseEvent<HTMLElement>): void {
      setMenuAnchor(event.currentTarget)
    }
  
    return <AppBar position='static'>
      <Toolbar>
        <Link href="/">
          <Typography
            variant='h6'
            flexGrow="1"
          >Sommer Sonntage</Typography>
        </Link>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={openMenu}
        >
        <MenuIcon />
      </IconButton>
      <Menu
        open={isMenuOpen}
        anchorEl={menuAnchor}
        onClose={closeMenu}
      >
        <MenuItem
          onClick={closeMenu}
        >Alle Tipprunden</MenuItem>
        <MenuItem
          onClick={closeMenu}
        >Aktuelle Tipprunde</MenuItem>
        <MenuItem
          onClick={closeMenu}
        >Ergebnisse aktuelle Tipprunde</MenuItem>
        <Divider sx={{my: .5}} />
        <MenuItem
          onClick={closeMenu}
        >Ausloggen</MenuItem>
      </Menu>
      </Toolbar>
    </AppBar>
  }