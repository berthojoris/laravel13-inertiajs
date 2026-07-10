import { Link } from '@inertiajs/react';
import {
    BookOpen,
    ClipboardCheck,
    ClipboardList,
    FileSpreadsheet,
    FolderGit2,
    LayoutGrid,
    Table2,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { index as report } from '@/routes/report';
import { create as survey } from '@/routes/survey';
import { create as surveyExtra } from '@/routes/survey-extra';
import { index as surveyExtraResults } from '@/routes/survey-extra-results';
import { index as surveyResults } from '@/routes/survey-results';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Survey',
        href: survey(),
        icon: ClipboardList,
    },
    {
        title: 'Survey Extra',
        href: surveyExtra(),
        icon: ClipboardCheck,
    },
    {
        title: 'Hasil Survey',
        href: surveyResults(),
        icon: Table2,
    },
    {
        title: 'Hasil Survey Extra',
        href: surveyExtraResults(),
        icon: Table2,
    },
    {
        title: 'Report',
        href: report(),
        icon: FileSpreadsheet,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: FolderGit2,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
