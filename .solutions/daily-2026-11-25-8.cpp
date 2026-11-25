#include <bits/stdc++.h>
using namespace std;
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;
    vector<string> codes(n);
    for (auto& s : codes) cin >> s;
    // 정렬하면 접두사는 바로 앞쪽에 모인다: 각 번호의 접두사를 정렬된 배열에서 이분 탐색
    vector<string> sorted_codes = codes;
    sort(sorted_codes.begin(), sorted_codes.end());
    int cnt = 0;
    for (auto& w : codes) {
        for (size_t L = 1; L < w.size(); L++) {
            string p = w.substr(0, L);
            if (binary_search(sorted_codes.begin(), sorted_codes.end(), p)) { cnt++; break; }
        }
    }
    cout << cnt << "\n";
    return 0;
}
