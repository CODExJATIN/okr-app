const SkeletonBone = ({ className }: { className: string }) => (
    <div className={`relative overflow-hidden bg-slate-200 ${className}`}>
        {/* The Shimmer Sweep */}
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent" />
    </div>
);

const FormSkeleton = () => (
    <div className="w-full p-6 space-y-8">
        {/* Header Skeleton */}
        <div className="flex flex-col items-center mb-10">
            <SkeletonBone className="w-14 h-14 rounded-2xl mb-4" />
            <SkeletonBone className="h-8 w-56 rounded-xl mb-2" />
            <SkeletonBone className="h-4 w-36 rounded-lg opacity-60" />
        </div>

        {/* Main Input Skeleton */}
        <div className="space-y-4">
            <SkeletonBone className="h-3 w-28 bg-indigo-100/50 rounded-full ml-1" />
            <SkeletonBone className="h-16 w-full rounded-[2rem]" />
        </div>

        {/* Key Results Container Skeleton */}
        <div className="bg-slate-50/50 p-6 rounded-[2.5rem] border border-slate-100 space-y-4">
            <div className="flex justify-between items-center mb-2 px-2">
                <SkeletonBone className="h-4 w-24 rounded-md" />
                <SkeletonBone className="h-4 w-12 rounded-md" />
            </div>
            <SkeletonBone className="h-14 w-full bg-white rounded-2xl border border-slate-100" />
            <SkeletonBone className="h-14 w-full bg-white rounded-2xl border border-slate-100" />
            <SkeletonBone className="h-14 w-full bg-white rounded-2xl border border-slate-100" />
        </div>

        {/* Divider Skeleton */}
        <div className="flex items-center gap-4">
            <div className="grow h-px bg-slate-100" />
            <SkeletonBone className="h-3 w-20 rounded-full" />
            <div className="grow h-px bg-slate-100" />
        </div>

        {/* Button Skeleton */}
        <SkeletonBone className="h-16 w-full rounded-[2rem] bg-slate-300" />

        <div className="flex justify-center">
            <SkeletonBone className="h-3 w-32 rounded-full opacity-40" />
        </div>
    </div>
);

export default FormSkeleton;