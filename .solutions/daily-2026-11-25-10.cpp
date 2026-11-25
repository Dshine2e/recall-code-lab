#include <bits/stdc++.h>
using namespace std;
// 세그먼트 트리(남은 사람 수)로 K번째 찾기 — Python 정답(펜윅)과 다른 방식으로 교차 확인
int sz;
vector<int> seg;
void build(int node, int l, int r) {
    if (l == r) { seg[node] = 1; return; }
    int mid = (l + r) / 2;
    build(node * 2, l, mid);
    build(node * 2 + 1, mid + 1, r);
    seg[node] = seg[node * 2] + seg[node * 2 + 1];
}
int take(int node, int l, int r, int k) {  // k번째(1부터) 남은 사람을 지우고 번호를 돌려준다
    seg[node]--;
    if (l == r) return l;
    int mid = (l + r) / 2;
    if (seg[node * 2] >= k) return take(node * 2, l, mid, k);
    return take(node * 2 + 1, mid + 1, r, k - seg[node * 2]);
}
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;
    seg.assign(4 * n + 4, 0);
    build(1, 1, n);
    long long start = 0, remain = n;
    string out;
    for (int t = 0; t < n; t++) {
        long long k;
        cin >> k;
        long long target = (start + k - 1) % remain;
        int who = take(1, 1, n, (int)target + 1);
        out += to_string(who);
        out += (t + 1 < n ? ' ' : '\n');
        remain--;
        if (remain) start = target % remain;
    }
    cout << out;
    return 0;
}
