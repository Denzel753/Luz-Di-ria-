#!/usr/bin/env python3
"""Corrige conflito de versões Kotlin no build.gradle do Capacitor."""
import sys

p = 'android/build.gradle'
try:
    content = open(p).read()
except FileNotFoundError:
    print(f'ERRO: {p} não encontrado')
    sys.exit(1)

fix = """
// Fix: força versão única do Kotlin stdlib (conflito jdk7/jdk8)
configurations.all {
    resolutionStrategy {
        force 'org.jetbrains.kotlin:kotlin-stdlib:1.8.22'
        force 'org.jetbrains.kotlin:kotlin-stdlib-jdk7:1.8.22'
        force 'org.jetbrains.kotlin:kotlin-stdlib-jdk8:1.8.22'
    }
}
"""

if 'force org.jetbrains.kotlin:kotlin-stdlib' not in content:
    content += fix
    open(p, 'w').write(content)
    print('Kotlin force aplicado em', p)
else:
    print('Fix já aplicado anteriormente')
