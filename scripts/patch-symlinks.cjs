/**
 * Patch para Windows: Reemplaza fs.symlink() con fs.copyFile/fs.cp
 * cuando Windows bloquea la creación de symlinks (EPERM).
 * Solo aplica al adaptador @astrojs/vercel durante el build local.
 */
const fs = require('fs');
const path = require('path');
const glob = require('child_process');

// Buscar el archivo fs.js de @astrojs/internal-helpers
const searchDir = path.join(__dirname, '..', 'node_modules', '.pnpm');

function findFile(dir, target) {
  try {
    const result = glob.execSync(
      `powershell -Command "Get-ChildItem -Recurse '${dir}' -Filter '${target}' | Where-Object { $_.FullName -match 'internal-helpers' } | Select-Object -First 1 -ExpandProperty FullName"`,
      { encoding: 'utf-8' }
    ).trim();
    return result || null;
  } catch {
    return null;
  }
}

const ORIGINAL = `    if (isSymlink) {
      const realdest = fileURLToPath(new URL(nodePath.relative(commonAncestor, realpath), outDir));
      const target = nodePath.relative(fileURLToPath(new URL(".", dest)), realdest);
      if (!existsSync(dest)) {
        await fs.symlink(target, dest, isDir ? "dir" : "file");
      }
    } else if (!isDir) {
      await fs.copyFile(origin, dest);
    }`;

const PATCHED = `    if (isSymlink) {
      if (!existsSync(dest)) {
        try {
          const realdest = fileURLToPath(new URL(nodePath.relative(commonAncestor, realpath), outDir));
          const target = nodePath.relative(fileURLToPath(new URL(".", dest)), realdest);
          await fs.symlink(target, dest, isDir ? "dir" : "file");
        } catch (symlinkErr) {
          if (symlinkErr.code === 'EPERM') {
            if (isDir) {
              await fs.cp(realpath, fileURLToPath(dest), { recursive: true });
            } else {
              await fs.copyFile(realpath, fileURLToPath(dest));
            }
          } else {
            throw symlinkErr;
          }
        }
      }
    } else if (!isDir) {
      await fs.copyFile(origin, dest);
    }`;

const fsJsPath = findFile(searchDir, 'fs.js');

if (!fsJsPath) {
  console.log('[patch-symlinks] No se encontró @astrojs/internal-helpers/dist/fs.js — omitido.');
  process.exit(0);
}

const content = fs.readFileSync(fsJsPath, 'utf-8');

if (content.includes("symlinkErr.code === 'EPERM'")) {
  console.log('[patch-symlinks] ✅ Ya está parcheado.');
  process.exit(0);
}

if (!content.includes('await fs.symlink(target, dest,')) {
  console.log('[patch-symlinks] ⚠️  No se encontró el código a parchear — posible nueva versión.');
  process.exit(0);
}

const patched = content.replace(ORIGINAL, PATCHED);

if (patched === content) {
  console.log('[patch-symlinks] ⚠️  No se pudo aplicar el parche (formato inesperado).');
  process.exit(0);
}

fs.writeFileSync(fsJsPath, patched, 'utf-8');
console.log(`[patch-symlinks] ✅ Parche aplicado en: ${fsJsPath}`);
