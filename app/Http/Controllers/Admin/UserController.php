<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UserStoreRequest;
use App\Http\Requests\UserUpdateRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserController extends Controller
{
public function index(Request $request)
{
$q       = (string) $request->string('q');
$perPage = (int) $request->input('per_page', 25);
if (!in_array($perPage, [10,25,50,100], true)) $perPage = 25;

$rows = User::query()
->when($q !== '', function ($qq) use ($q) {
$qq->where(function($w) use ($q){
$w->where('name','like',"%{$q}%")
->orWhere('email','like',"%{$q}%");
});
})
->orderByDesc('id')
->paginate($perPage)
->withQueryString();

$rows->getCollection()->transform(function(User $u){
return [
'id'         => $u->id,
'name'       => $u->name,
'email'      => $u->email,
'avatar_url' => $this->gravatar($u->email, 96),
'created_at' => $u->created_at?->toIso8601String(),
];
});

return Inertia::render('Admin/users/Index', [
'users'   => $rows,
'filters' => [
'q'        => $q,
'per_page' => $perPage,
],
]);
}

public function show(User $user)
{
return Inertia::render('Admin/users/Show', [
'user' => [
'id'         => $user->id,
'name'       => $user->name,
'email'      => $user->email,
'avatar_url' => $this->gravatar($user->email, 128),
],
]);
}

public function create()
{
return Inertia::render('Admin/users/Form', [
'mode' => 'create',
'user' => null,
]);
}

public function store(UserStoreRequest $request)
{
$data = $request->validated();

$user = new User();
$user->name  = $data['name'];
$user->email = $data['email'];
$user->password = Hash::make($data['password']);
$user->save();

return to_route('admin.users.index')->with('success','Utworzono użytkownika.');
}

public function edit(User $user)
{
return Inertia::render('Admin/users/Form', [
'mode' => 'edit',
'user' => [
'id'    => $user->id,
'name'  => $user->name,
'email' => $user->email,
],
]);
}

public function update(UserUpdateRequest $request, User $user)
{
$data = $request->validated();

$user->name  = $data['name'];
$user->email = $data['email'];

if (!empty($data['password'])) {
$user->password = Hash::make($data['password']);
}

$user->save();

return $request->boolean('stay')
? back()->with('success','Zaktualizowano.')
: to_route('admin.users.index')->with('success','Zaktualizowano.');
}

public function destroy(User $user)
{
// (opcjonalnie) zablokuj usunięcie samego siebie:
if (auth()->id() === $user->id) {
return back()->with('error','Nie możesz usunąć samego siebie.');
}

$user->delete();
return back()->with('success','Usunięto użytkownika.');
}

private function gravatar(string $email, int $size = 80): string
{
$hash = md5(strtolower(trim($email)));
return "https://www.gravatar.com/avatar/{$hash}?s={$size}&d=identicon";
}
}
