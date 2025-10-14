<?php

namespace App\Http\Middleware;

use App\Models\Page;
use Closure;
use Illuminate\Http\Request;

class EnforcePageVisibility
{
    /** Ścieżki, których nie sprawdzamy (admin, assets, stałe publiczne). */
    protected array $allowlistPrefixes = [
        'admin','storage','build','assets','_ignition',
        'login','register','password',
        'offers','aplikacja','szybka-aplikacja','kontakt','partnerzy',
    ];

    public function handle(Request $request, Closure $next)
    {
        if (!in_array($request->method(), ['GET','HEAD'], true)) {
            return $next($request);
        }

        $path = trim($request->path(), '/');           // '' | 'o-nas' | 'privacy-policy'
        $slug = $path === '' ? '/' : "/{$path}";

        $first = $path === '' ? '' : explode('/', $path)[0];
        if ($first !== '' && in_array($first, $this->allowlistPrefixes, true)) {
            return $next($request);
        }

        // Jeśli to strona z tabeli "pages" → sprawdź widoczność wg locale
        if ($page = Page::where('slug', $slug)->first()) {
            $locale  = app()->getLocale(); // 'pl' | 'de'
            $visible = $locale === 'de' ? (bool)$page->visible_de : (bool)$page->visible_pl;
            if (!$visible) abort(404);
        }

        return $next($request);
    }
}
