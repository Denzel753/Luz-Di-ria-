sed -i 's/interface HeaderProps {/interface HeaderProps {\n  enableQuotes?: boolean;\n  onToggleQuotes?: (enabled: boolean) => void;/' src/components/Header.tsx
sed -i 's/onAboutClick }: HeaderProps/onAboutClick, enableQuotes, onToggleQuotes }: HeaderProps/' src/components/Header.tsx
