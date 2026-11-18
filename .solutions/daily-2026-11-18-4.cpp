#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;
    vector<int> h(n);
    for (auto &x : h) cin >> x;
    vector<int> cnt(n, 0);
    long long total = 0;
    vector<int> st;  // 키가 엄격하게 줄어드는 사람 번호
    st.reserve(n);
    for (int j = 0; j < n; j++) {
        bool sameFound = false;
        while (!st.empty() && h[st.back()] <= h[j]) {
            int i = st.back();
            st.pop_back();
            cnt[i]++, cnt[j]++, total++;
            if (h[i] == h[j]) {
                sameFound = true;
                break;
            }
        }
        if (!sameFound && !st.empty()) {
            int i = st.back();
            cnt[i]++, cnt[j]++, total++;
        }
        st.push_back(j);
    }
    cout << total << "\n";
    for (int i = 0; i < n; i++) cout << cnt[i] << (i + 1 < n ? ' ' : '\n');
    return 0;
}
