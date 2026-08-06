#!/usr/bin/env python3
"""Corrige conflito de versões Kotlin no projeto Capacitor (app/build.gradle)."""
import sys, os

# O bloco de resolução precisa ir no app/build.gradle, onde o Gradle resolve
# as dependências do módulo :app (onde ocorre o checkDebugDuplicateClasses).
targets = ['android/app/build.gradle', 'app/build.gradle']
found = None
for t in targets:
    if os.path.exists(t):
        found = t
        break

if not found:
    print('ERRO: app/build.gradle não encontrado')
    sys.exit(1)

content = open(found).read()

fix = """
// Fix: elimina conflito de Kotlin stdlib duplicado (jdk7/jdk8 antigos)
configurations.all {
    exclude group: 'org.jetbrains.kotlin', module: 'kotlin-stdlib-jdk7'
    exclude group: 'org.jetbrains.kotlin', module: 'kotlin-stdlib-jdk8'
    resolutionStrategy {
        force 'org.jetbrains.kotlin:kotlin-stdlib:1.8.22'
    }
}
"""

if 'kotlin-stdlib-jdk7' not in content:
    content += fix
    open(found, 'w').write(content)
    print(f'Fix aplicado em {found}')
else:
    print('Fix já presente')
