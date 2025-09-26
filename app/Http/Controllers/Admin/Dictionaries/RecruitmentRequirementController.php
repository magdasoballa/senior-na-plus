<?php

namespace App\Http\Controllers\Admin\Dictionaries;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Dictionaries\RecruitmentRequirementRequest;
use App\Models\RecruitmentRequirement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class RecruitmentRequirementController extends Controller
{
    public function index(Request $request)
    {

        $q = trim((string)$request->get('q',''));

        $rows = RecruitmentRequirement::query()
            ->when($q !== '', function($b) use ($q){
                $like = "%{$q}%";
                $b->where('title','like',$like)->orWhere('body','like',$like);
            })
            ->orderBy('position')->orderBy('id')
            ->paginate(15)->withQueryString();

        // tylko to, co potrzebne do listy
        $rows->getCollection()->transform(fn(RecruitmentRequirement $r) => [
            'id'         => $r->id,
            'title'      => $r->title,
            'image_url'  => $r->image_url,
            'is_visible' => $r->is_visible,
        ]);

        return Inertia::render('Admin/dictionaries/recruitment-reqs/Index', [
            'requirements' => $rows,
            'filters'      => ['q' => $q],
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/dictionaries/recruitment-reqs/Form', ['req' => null]);
    }

    public function store(RecruitmentRequirementRequest $request)
    {
        $data = $request->validated();
        $max  = (int) RecruitmentRequirement::max('position');

        $req = new RecruitmentRequirement();
        $req->title      = $data['title'];
        $req->body       = $data['body'];
        $req->is_visible = (bool)($data['is_visible'] ?? false);
        $req->position   = $max + 1;

        if ($request->hasFile('image')) {
            $req->image_path = $request->file('image')->store('recruitment-reqs','public');
        }

        $req->save();

        return to_route('admin.dict.recruitment-reqs.index')->with('success','Utworzono');
    }

    public function show(RecruitmentRequirement $recruitment_req)
    {
        return Inertia::render('Admin/dictionaries/recruitment-reqs/Show', [
            'req' => [
                'id'         => $recruitment_req->id,
                'title'      => $recruitment_req->title,
                'body'       => $recruitment_req->body,
                'image_url'  => $recruitment_req->image_url,
                'is_visible' => $recruitment_req->is_visible,
                'created_at' => $recruitment_req->created_at,
                'updated_at' => $recruitment_req->updated_at,
            ],
        ]);
    }

    public function edit(RecruitmentRequirement $recruitment_req)
    {
        return Inertia::render('Admin/dictionaries/recruitment-reqs/Form', [
            'req' => [
                'id'         => $recruitment_req->id,
                'title'      => $recruitment_req->title,
                'body'       => $recruitment_req->body,
                'image_url'  => $recruitment_req->image_url,
                'is_visible' => $recruitment_req->is_visible,
            ],
        ]);
    }

    public function update(RecruitmentRequirementRequest $request, RecruitmentRequirement $recruitment_req)
    {
        $data = $request->validated();

        $recruitment_req->fill([
            'title'      => $data['title'],
            'body'       => $data['body'],
            'is_visible' => (bool)($data['is_visible'] ?? false),
        ]);

        if (!empty($data['remove_image'])) {
            $recruitment_req->deleteImage();
        }
        if ($request->hasFile('image')) {
            $recruitment_req->deleteImage();
            $recruitment_req->image_path = $request->file('image')->store('recruitment-reqs','public');
        }

        $recruitment_req->save();

        return $request->input('redirectTo') === 'continue'
            ? to_route('admin.dict.recruitment-reqs.edit', $recruitment_req)->with('success','Zapisano')
            : to_route('admin.dict.recruitment-reqs.index')->with('success','Zapisano');
    }

    public function destroy(RecruitmentRequirement $recruitment_req)
    {
        $recruitment_req->deleteImage();
        $recruitment_req->delete();
        return to_route('admin.dict.recruitment-reqs.index')->with('success','Usunięto');
    }

    // opcjonalny drag&drop
    public function reorder(Request $request)
    {
        $ids = $request->input('ids', []);
        if (!is_array($ids) || empty($ids)) return response()->json(['ok'=>true]);

        DB::transaction(function () use ($ids) {
            foreach ($ids as $pos => $id) {
                RecruitmentRequirement::where('id',$id)->update(['position'=>$pos+1]);
            }
        });

        return response()->json(['ok'=>true]);
    }
}
