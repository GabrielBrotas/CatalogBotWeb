import React from 'react'
import { Stack } from '@chakra-ui/react'
import { RiContactsLine, RiDashboardLine, RiWhatsappLine } from 'react-icons/ri'
import { BsBag, BsGraphUp, BsGrid1X2 } from 'react-icons/bs'
import { NavLink } from './NavLink'
import { NavSection } from './NavSection'

export function SidebarNav() {
  return (
    <Stack spacing="12" align="flex-start">
      <NavSection title="GERAL">
        <NavLink title="Dashboard" href="/dashboard" icon={BsGraphUp} />
        <NavLink title="Produtos" href="/products" icon={RiDashboardLine} />
        <NavLink title="Categorias" href="/categories" icon={BsGrid1X2} />
        <NavLink title="Ordens" href="/orders" icon={BsBag} />
      </NavSection>

      <NavSection title="INTEGRAÇÃO">
        <NavLink title="Whatsapp" href="/whatsapp" icon={RiWhatsappLine} />
      </NavSection>

      <NavSection title="CONFIGURAÇÕES">
        <NavLink title="Perfil" href="/profile" icon={RiContactsLine} />
      </NavSection>
    </Stack>
  )
}
